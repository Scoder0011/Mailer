import os
import smtplib
from typing import Optional
import time
import re
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import datetime
from sqlalchemy.orm import Session
from models import Campaign, Recipient

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


class CampaignWorker:
    def __init__(self):
        self.status = "Stopped"          # Running, Paused, Stopped, Completed
        self.logs = []
        self.current_index = 0
        self.total_count = 0
        self.sent_count = 0
        self.failed_count = 0
        self._thread = None
        self._lock = threading.Lock()

        # runtime configuration (set by start())
        self.config = {}
        self.attachment_path = None

    # ---------- public API (unchanged signatures) ----------

    def add_log(self, message: str):
        """Append a timestamped log message (also printed to console)."""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        self.logs.append(log_entry)
        print(log_entry)   # also show in terminal

    def validate_email(self, email: str) -> bool:
        return bool(EMAIL_REGEX.match(email))

    def parse_template(self, template: str, recipient: Recipient) -> str:
        """
        Replace placeholders in a string with recipient data.
        Supports {{name}}, {{recipient_name}}, {{company}}, {{recipient_company}},
        {{email}}, {{recipient_email}}.
        If recipient.name is empty, falls back to recipient.company, then "there".
        """
        # Build replacement values with fallback logic
        name = (
    recipient.name.strip()
    if recipient.name and recipient.name.strip()
    else (
        recipient.company.strip()
        if recipient.company and recipient.company.strip()
        else "there"
    )
)
        company = recipient.company or "there"
        email = recipient.email or ""

        replacements = {
            "{{name}}": name,
            "{{recipient_name}}": name,
            "{{company}}": company,
            "{{recipient_company}}": company,
            "{{email}}": email,
            "{{recipient_email}}": email,
        }

        result = template
        for placeholder, value in replacements.items():
            result = result.replace(placeholder, value)
        return result

    def send_single_mail(self, server, recipient: Recipient) -> bool:
        """
        Build and send a single email.
        Raises an exception on failure, returns True on success.
        """
        msg = self._build_message(recipient)
        server.sendmail(self.config['sender_email'], recipient.email, msg.as_string())
        return True

    # ---------- internal helpers ----------

    def _build_message(self, recipient: Recipient) -> MIMEMultipart:
        """Construct the MIME message with parsed subject, body and optional attachment."""
        msg = MIMEMultipart()
        msg['From'] = self.config['sender_email']
        msg['To'] = recipient.email

        # Parse subject and body using the same placeholder logic
        subject = self.parse_template(self.config['subject'], recipient)
        body = self.parse_template(self.config['body'], recipient)

        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        # Attach file if provided and exists
        if self.attachment_path and os.path.exists(self.attachment_path):
            self._attach_file(msg, self.attachment_path)

        return msg

    def _attach_file(self, msg: MIMEMultipart, file_path: str):
        """Attach a file to the email message."""
        filename = os.path.basename(file_path)
        with open(file_path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header(
    "Content-Disposition",
    f'attachment; filename="{filename}"'
)
        msg.attach(part)

    def _connect_smtp(self):
        """Establish a TLS connection to Gmail SMTP."""
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(self.config['sender_email'], self.config['app_password'])
        return server

    # ---------- main campaign loop ----------

    def run_loop(self, db_session_factory, campaign_id: int):
        self.add_log("Starting campaign...")

        db: Session = db_session_factory()
        server = None

        try:
            campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
            if not campaign:
                self.status = "Stopped"
                self.add_log("Error: campaign not found.")
                return

            # Load pending recipients
            recipients = db.query(Recipient).filter(
                Recipient.campaign_id == campaign_id,
                Recipient.status == "Pending"
            ).all()

            # Initialise counters
            self.total_count = db.query(Recipient).filter(
                Recipient.campaign_id == campaign_id
            ).count()
            self.sent_count = db.query(Recipient).filter(
                Recipient.campaign_id == campaign_id,
                Recipient.status == "Sent"
            ).count()
            self.failed_count = db.query(Recipient).filter(
                Recipient.campaign_id == campaign_id,
                Recipient.status.in_(["Failed", "Invalid"])
            ).count()

            # Connect to SMTP
            try:
                server = self._connect_smtp()
            except Exception as e:
                self.status = "Stopped"
                campaign.status = "Stopped"
                db.commit()
                self.add_log(f"SMTP connection failed: {e}")
                return

            # Print campaign start banner
            print("\n" + "=" * 48)
            print(f"Campaign started: {campaign.title or 'Untitled'}")
            print(f"Total recipients: {self.total_count}")
            print("=" * 48 + "\n")

            # Process each recipient
            for idx, recipient in enumerate(recipients):
                # Handle pause
                while self.status == "Paused":
                    time.sleep(1)

                if self.status == "Stopped":
                    self.add_log("Campaign stopped by user.")
                    break

                self.current_index = self.sent_count + self.failed_count + 1

                # Validate email
                if not self.validate_email(recipient.email):
                    recipient.status = "Invalid"
                    recipient.error_message = "Invalid email format"
                    self.failed_count += 1
                    db.commit()
                    self.add_log(f"Skipped invalid email: {recipient.email}")
                    continue

                # Send email
                try:
                    self.send_single_mail(server, recipient)
                    recipient.status = "Sent"
                    recipient.sent_at = datetime.datetime.utcnow()
                    self.sent_count += 1
                    self.add_log(f"✓ Email sent to {recipient.email}")
                    print(f"✓ ({self.current_index}/{self.total_count}) {recipient.email}")
                except Exception as e:
                    recipient.status = "Failed"
                    recipient.error_message = str(e)
                    self.failed_count += 1
                    self.add_log(f"✗ Failed to send to {recipient.email}: {e}")
                    print(f"✗ Failed ({self.current_index}/{self.total_count}) {recipient.email}: {e}")

                db.commit()

                # Apply delay (except after last recipient)
                if idx < len(recipients) - 1 and self.status == "Running":
                    delay = self.config.get('delay_seconds', 15)
                    self.add_log(f"Waiting {delay}s before next email...")
                    time.sleep(delay)

            # Final status
            if self.status == "Running":
                self.status = "Completed"
                campaign.status = "Completed"
                self.add_log("Campaign completed successfully.")
                print("\n" + "=" * 48)
                print("Campaign completed successfully.")
                print(f"Sent: {self.sent_count}, Failed: {self.failed_count}")
                print("=" * 48 + "\n")
            else:
                campaign.status = self.status
                self.add_log(f"Campaign stopped with status: {self.status}")

            db.commit()

        except Exception as e:
            self.add_log(f"Fatal error in campaign: {e}")
            self.status = "Stopped"
            if campaign:
                campaign.status = "Stopped"
                db.commit()
        finally:
            # Always close SMTP connection gracefully
            if server:
                try:
                    server.quit()
                except Exception:
                    pass
            db.close()

    # ---------- control methods ----------

    def start(self, db_session_factory, campaign_id: int, config: dict, attachment_path: Optional[str]):
        with self._lock:
            if self.status == "Running":
                return False
            self.status = "Running"
            self.config = config
            self.attachment_path = attachment_path
            self._thread = threading.Thread(target=self.run_loop, args=(db_session_factory, campaign_id))
            self._thread.daemon = True
            self._thread.start()
            return True

    def pause(self):
        with self._lock:
            if self.status == "Running":
                self.status = "Paused"
                self.add_log("Campaign paused.")

    def resume(self):
        with self._lock:
            if self.status == "Paused":
                self.status = "Running"
                self.add_log("Campaign resumed.")

    def stop(self):
        with self._lock:
            if self.status in ["Running", "Paused"]:
                self.status = "Stopped"
                self.add_log("Campaign stopped by user.")


# Global worker instance
worker_engine = CampaignWorker()