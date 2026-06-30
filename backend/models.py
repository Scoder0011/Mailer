from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class AppSettings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    sender_email = Column(String, default="")
    saved_app_password = Column(String, default="")  # Only if explicit remember checked
    delay_seconds = Column(Integer, default=15)
    last_subject = Column(Text, default="")

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Campaign")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Pending") # Pending, Running, Paused, Stopped, Completed
    recipients = relationship("Recipient", back_populates="campaign", cascade="all, delete-orphan")

class Recipient(Base):
    __tablename__ = "recipients"
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    email = Column(String, index=True)
    name = Column(String, default="")
    company = Column(String, default="")
    status = Column(String, default="Pending") # Pending, Sent, Failed, Invalid
    error_message = Column(Text, default="")
    sent_at = Column(DateTime, nullable=True)

    campaign = relationship("Campaign", back_populates="recipients")