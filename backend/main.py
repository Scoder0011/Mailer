import os
import shutil
import io
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import pandas as pd

import models, schemas, database
from mailer import worker_engine, EMAIL_REGEX
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title=" Mailer Backend API Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

CURRENT_FILE_DATA = {"recipients": [], "attachment": None}

@app.post("/api/upload-recipients")
def upload_recipients(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".csv", ".xlsx"]:
        raise HTTPException(status_code=400, detail="Only CSV and XLSX files are supported. Only .csv or .xlsx parsing variants supported.")
    
    try:
        contents = file.file.read()
        if ext == ".csv":
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
        
        df.columns = [c.lower().strip() for c in df.columns]
        if "email" not in df.columns:
            raise HTTPException(status_code=400, detail="Missing critical mandatory semantic baseline structural column framework context: 'email'")

        # Drop complete structural duplicates relative to uniqueness pipelines
        df = df.drop_duplicates(subset=["email"])
        
        parsed_records = []
        for _, row in df.iterrows():
            email_val = str(row["email"]).strip() if pd.notna(row["email"]) else ""
            if not email_val:
                continue
            name_val = str(row["name"]).strip() if "name" in df.columns and pd.notna(row["name"]) else ""
            company_val = str(row["company"]).strip() if "company" in df.columns and pd.notna(row["company"]) else ""
            
            parsed_records.append({
                "email": email_val,
                "name": name_val,
                "company": company_val
            })
            
        CURRENT_FILE_DATA["recipients"] = parsed_records
        return {"status": "Success", "count": len(parsed_records), "records": parsed_records}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing recipient data structural baseline files: {str(e)}")

@app.post("/api/upload-attachment")
def upload_attachment(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail="Unsupported attachment profile schema framework.")
    
    # 10 MB Constraint
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Payload file sizes cannot surpass hard limitations of 10 MB constraints.")

    dest_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    CURRENT_FILE_DATA["attachment"] = dest_path
    return {"status": "File indexed successfully", "path": dest_path}

@app.post("/api/send-test")
def send_test_email(payload: schemas.TestEmailRequest):
    if not EMAIL_REGEX.match(payload.sender_email):
        raise HTTPException(status_code=400, detail="Invalid programmatic formatting profile schema parameters for sender email structure.")
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(payload.sender_email, payload.app_password)
        
        msg = MIMEMultipart()
        msg['From'] = payload.sender_email
        msg['To'] = payload.sender_email
        msg['Subject'] = f"[TEST Run Verification] {payload.subject}"
        
        # Build out pseudo model instantiation mappings to pass to operational parser engines
        class PseudoRecipient:
            name = "Test-Representative"
            company = "Mailer Testing Hub"
            
        from mailer import CampaignWorker
        body_content = CampaignWorker.parse_template(None, payload.body, PseudoRecipient)
        msg.attach(MIMEText(body_content, 'plain'))
        
        # Attach the current application session file context structural elements to verification routes
        if CURRENT_FILE_DATA["attachment"] and os.path.exists(CURRENT_FILE_DATA["attachment"]):
            fname = os.path.basename(CURRENT_FILE_DATA["attachment"])
            with open(CURRENT_FILE_DATA["attachment"], "rb") as attachment:
                from email.mime.base import MIMEBase
                from email import encoders
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header("Content-Disposition", f"attachment; filename= {fname}")
                msg.attach(part)

        server.sendmail(payload.sender_email, payload.sender_email, msg.as_string())
        server.quit()
        return {"status": "Success", "detail": "Test verification vector executed smoothly across execution arrays."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication test validation framework system block failure: {str(e)}")

@app.post("/api/start-campaign")
def start_campaign(payload: schemas.StartCampaignRequest, db: Session = Depends(database.get_db)):
    if not CURRENT_FILE_DATA["recipients"]:
        raise HTTPException(status_code=400, detail="Recipient list not uploaded.")
    
    if worker_engine.status == "Running":
        raise HTTPException(status_code=400, detail="A campaign is already running. Wait for running campaign completion contexts.")

    # Application settings preservation
    app_setting = db.query(models.AppSettings).first()
    if not app_setting:
        app_setting = models.AppSettings()
        db.add(app_setting)
    
    app_setting.sender_email = payload.sender_email
    app_setting.delay_seconds = payload.delay_seconds
    app_setting.last_subject = payload.subject
    if payload.remember_password:
        app_setting.saved_app_password = payload.app_password
    else:
        app_setting.saved_app_password = ""
    db.commit()

    # Model compilation orchestration
    campaign = models.Campaign(title=payload.subject, status="Running")
    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    for r in CURRENT_FILE_DATA["recipients"]:
        recip = models.Recipient(
            campaign_id=campaign.id,
            email=r["email"],
            name=r["name"],
            company=r["company"],
            status="Pending"
        )
        db.add(recip)
    db.commit()

    config_dict = {
        "sender_email": payload.sender_email,
        "app_password": payload.app_password,
        "subject": payload.subject,
        "body": payload.body,
        "delay_seconds": payload.delay_seconds
    }

    worker_engine.logs = []
    started = worker_engine.start(
        db_session_factory=database.SessionLocal,
        campaign_id=campaign.id,
        config=config_dict,
        attachment_path=CURRENT_FILE_DATA["attachment"]
    )

    if not started:
        raise HTTPException(status_code=500, detail="Worker thread initialization failure.")

    return {"status": "Campaign Engine Booted", "campaign_id": campaign.id}

@app.post("/api/pause-campaign")
def pause_campaign():
    worker_engine.pause()
    return {"status": "Success", "state": worker_engine.status}

@app.post("/api/resume-campaign")
def resume_campaign():
    worker_engine.resume()
    return {"status": "Success", "state": worker_engine.status}

@app.post("/api/stop-campaign")
def stop_campaign():
    worker_engine.stop()
    return {"status": "Success", "state": worker_engine.status}

@app.post("/api/retry-failed")
def retry_failed_emails(payload: schemas.StartCampaignRequest, db: Session = Depends(database.get_db)):
    if worker_engine.status == "Running":
        raise HTTPException(status_code=400, detail="Cannot initialize retry loops while core tasks run.")
    
    last_campaign = db.query(models.Campaign).order_by(models.Campaign.id.desc()).first()
    if not last_campaign:
        raise HTTPException(status_code=404, detail="No valid operational campaign profiles discovered across data clusters.")

    failed_recipients = db.query(models.Recipient).filter(
        models.Recipient.campaign_id == last_campaign.id,
        models.Recipient.status.in_(["Failed", "Invalid"])
    ).all()

    if not failed_recipients:
        return {"status": "No-Op", "detail": "Zero transaction processing points verified inside failure tables."}

    for r in failed_recipients:
        r.status = "Pending"
        r.error_message = ""
    
    last_campaign.status = "Running"
    db.commit()

    config_dict = {
        "sender_email": payload.sender_email,
        "app_password": payload.app_password,
        "subject": payload.subject,
        "body": payload.body,
        "delay_seconds": payload.delay_seconds
    }

    worker_engine.logs.append("[SYSTEM EVENT] Initiating target exception error collection retries...")
    worker_engine.start(
        db_session_factory=database.SessionLocal,
        campaign_id=last_campaign.id,
        config=config_dict,
        attachment_path=CURRENT_FILE_DATA["attachment"]
    )
    return {"status": "Retry Engine Dispatched", "campaign_id": last_campaign.id}

@app.get("/api/progress")
def get_progress():
    return {
        "status": worker_engine.status,
        "total": worker_engine.total_count,
        "sent": worker_engine.sent_count,
        "failed": worker_engine.failed_count,
        "current_index": worker_engine.current_index
    }

@app.get("/api/logs")
def get_logs(search: str = ""):
    filtered_logs = worker_engine.logs
    if search:
        filtered_logs = [log for log in worker_engine.logs if search.lower() in log.lower()]
    return {"logs": filtered_logs}

@app.get("/api/settings")
def get_settings(db: Session = Depends(database.get_db)):
    settings_obj = db.query(models.AppSettings).first()
    if not settings_obj:
        return {"sender_email": "", "delay_seconds": 15, "last_subject": "", "saved_app_password": ""}
    return {
        "sender_email": settings_obj.sender_email,
        "delay_seconds": settings_obj.delay_seconds,
        "last_subject": settings_obj.last_subject,
        "saved_app_password": settings_obj.saved_app_password
    }

@app.get("/api/download-report")
def download_report(db: Session = Depends(database.get_db)):
    last_campaign = db.query(models.Campaign).order_by(models.Campaign.id.desc()).first()
    if not last_campaign:
        raise HTTPException(status_code=404, detail="Reports generation failed. No tracking campaigns discovered.")
    
    recipients = db.query(models.Recipient).filter(models.Recipient.campaign_id == last_campaign.id).all()
    
    report_data = []
    for r in recipients:
        report_data.append({
            "Email": r.email,
            "Company": r.company,
            "Status": r.status,
            "Error Message": r.error_message,
            "Timestamp": r.sent_at.strftime("%Y-%m-%d %H:%M:%S") if r.sent_at else ""
        })

    df = pd.DataFrame(report_data)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=campaign_report_{last_campaign.id}.csv"
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)