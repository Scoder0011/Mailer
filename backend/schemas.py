from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class SettingsSchema(BaseModel):
    sender_email: str
    remember_password: bool
    app_password: Optional[str] = None
    delay_seconds: int = 15
    last_subject: Optional[str] = None

class TestEmailRequest(BaseModel):
    sender_email: str
    app_password: str
    subject: str
    body: str

class StartCampaignRequest(BaseModel):
    sender_email: str
    app_password: str
    subject: str
    body: str
    delay_seconds: int = 15
    remember_password: bool