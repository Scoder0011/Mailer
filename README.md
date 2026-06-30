# 📧 Mailer

**Mailer** is a modern, local email campaign application built with **FastAPI**, **React**, and **SQLite**. It allows you to send personalized emails to multiple recipients using Gmail SMTP with support for CSV/XLSX imports, attachments, placeholders, live progress tracking, and downloadable reports.

Whether you're contacting clients, companies, communities, event participants, students, or organizations, Mailer helps automate repetitive email sending while keeping every message personalized.

---

## ✨ Features

* 📧 Send personalized bulk emails
* 📄 Import recipients from CSV or XLSX
* 🏷 Personalize both **Subject** and **Body**
* 📎 Attach PDF, DOCX, JPG, JPEG, or PNG files
* 📊 Live campaign progress
* 📋 Real-time activity logs
* 📥 Download campaign reports
* ⏸ Pause, Resume, and Stop campaigns
* 🔄 Retry failed emails
* 🌙 Modern responsive interface with Dark Mode

---

## 🖼 Preview

> *(Add screenshots here after uploading them.)*

* Dashboard
* Compose Email
* Campaign Progress
* Report Download

---

## 🛠 Tech Stack

### Frontend

* React
* Tailwind CSS
* Vite

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Gmail SMTP

---

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/Scoder0011/Mailer.git
cd Mailer
```

---

## Install Backend

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

Install dependencies

```bash
pip install -r requirements.txt
```

Run the backend

```bash
uvicorn main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

---

## Install Frontend

Open another terminal.

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# 🔐 Gmail Setup

This application uses Gmail SMTP for sending emails.

To use it:

1. Go to your Google Account.
2. Enable **2-Step Verification**.
3. Open **App Passwords**.
4. Create a new App Password.
5. Use:

* Your Gmail address
* The generated 16-character App Password

**Do not use your normal Gmail password.**

---

## 📄 Recipient File Format

Supported:

* CSV
* XLSX

Example:

```csv
email,name,company
john@example.com,John Doe,Microsoft
alice@example.com,Alice Johnson,Google
```

---

## 🏷 Supported Placeholders

| Placeholder             | Description     |
| ----------------------- | --------------- |
| `{{name}}`              | Recipient name  |
| `{{recipient_name}}`    | Recipient name  |
| `{{company}}`           | Company         |
| `{{recipient_company}}` | Company         |
| `{{email}}`             | Recipient email |
| `{{recipient_email}}`   | Recipient email |

These placeholders work in both the **Subject** and **Body**.

Example subject:

```
Partnership Opportunity with {{company}}
```

---

## 🚀 Usage

1. Start the backend.
2. Start the frontend.
3. Open the application.
4. Enter your Gmail address.
5. Enter your Google App Password.
6. Write your subject.
7. Write your email.
8. Upload a CSV/XLSX file.
9. (Optional) Upload an attachment.
10. Send a test email.
11. Start the campaign.
12. Monitor the progress.
13. Download the campaign report.

---

## 📊 Reports

After each campaign you can download a report containing:

* Recipient Email
* Company
* Status
* Error Message
* Timestamp

---

## ⚠ Gmail Sending Limits

Google applies daily sending limits.

For larger campaigns, use a delay between emails to reduce the chance of temporary rate limits.

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Suraj Chauhan**

GitHub:
https://github.com/Scoder0011

