# NGO Mailer

NGO Mailer is a local web application that helps NGOs send personalized outreach emails to multiple companies using Gmail SMTP. It allows you to upload a list of recipients, personalize emails using placeholders, attach documents, monitor campaign progress, and download campaign reports.

> **Note:** This project is intended for legitimate outreach, such as CSR proposals, sponsorship requests, partnership opportunities, and other authorized communications.

---

# Features

* 📧 Send personalized emails in bulk
* 📄 Upload recipient lists using CSV or XLSX
* 📎 Attach PDF, DOCX, JPG, JPEG, or PNG files
* 📝 Personalize email subject and body using placeholders
* 📊 Live campaign progress
* 📋 Campaign logs
* 📥 Download campaign report (CSV)
* ⏸ Pause, resume, and stop campaigns
* 🔄 Retry failed emails
* 🌙 Modern responsive UI with Dark Mode

---

# Supported Placeholders

You can use the following placeholders in both the **Subject** and **Body**.

| Placeholder             | Description     |
| ----------------------- | --------------- |
| `{{name}}`              | Recipient name  |
| `{{recipient_name}}`    | Recipient name  |
| `{{company}}`           | Company name    |
| `{{recipient_company}}` | Company name    |
| `{{email}}`             | Recipient email |
| `{{recipient_email}}`   | Recipient email |

Example Subject:

```text
Partnership Opportunity with {{company}}
```

Example Body:

```text
Hello {{name}},

We would love to connect with {{company}} regarding a CSR partnership opportunity.
```

---

# Recipient File Format

The recipient list must be a **CSV** or **XLSX** file.

Example:

```csv
email,name,company
john@example.com,John Doe,Microsoft
alice@example.com,Alice,Google
```

The **email** column is required.

The **name** and **company** columns are optional.

---

# Requirements

* Python 3.11+
* Node.js 18+
* npm

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ngo-mailer.git
cd ngo-mailer
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

The backend will start on:

```text
http://127.0.0.1:8000
```

---

## 3. Frontend Setup

Open a new terminal.

```bash
cd frontend

npm install

npm run dev
```

The frontend will usually start on:

```text
http://localhost:3000
```

or

```text
http://localhost:5173
```

depending on your Vite configuration.

---

# Gmail Setup

This project uses **Gmail SMTP**.

Before sending emails:

1. Enable **2-Step Verification** on your Google account.
2. Generate a **Google App Password**.
3. Use your Gmail address and App Password inside the application.

**Do not use your normal Gmail password.**

---

# How to Use

1. Start the backend.
2. Start the frontend.
3. Open the application.
4. Enter:

   * Gmail address
   * Google App Password
   * Subject
   * Email body
5. Upload a CSV/XLSX recipient file.
6. (Optional) Upload an attachment.
7. Click **Send Test Email**.
8. Verify the email arrives correctly.
9. Click **Start Campaign** to begin sending.
10. Monitor the progress and download the campaign report when finished.

---

# Reports

After a campaign completes, you can download a CSV report containing:

* Recipient Email
* Company
* Delivery Status
* Error Message (if any)
* Timestamp

---

# Supported Attachments

* PDF
* DOCX
* PNG
* JPG
* JPEG

Maximum file size: **10 MB**

---

# Notes

* This application runs locally.
* Your Gmail App Password is only used to authenticate with Gmail SMTP.
* Use the tool responsibly and only send emails to recipients who are appropriate for your outreach.

---

# Project Structure

```text
ngo-mailer/
│
├── backend/
├── frontend/
├── uploads/
├── reports/
├── screenshots/
├── README.md
└── requirements.txt
```

---

# License

This project is released under the MIT License.

---

# Author

**Suraj Chauhan**

Built to simplify NGO outreach and partnership campaigns through secure and personalized email automation.
