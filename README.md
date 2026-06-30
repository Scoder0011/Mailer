# 📧 Mailer

A simple desktop web application for sending personalized emails to multiple recipients using your Gmail account.

Instead of sending the same email one by one, Mailer lets you:

- Upload a list of recipients from Excel or CSV
- Personalize each email automatically
- Attach documents
- Track sending progress
- Download a report after the campaign finishes

**Perfect for:** NGOs, small businesses, colleges, clubs, communities, event organizers, recruiters, and marketing teams.

---

## 🖥 System Requirements

Before installing Mailer, make sure you have:

- Windows 10/11, Linux, or macOS
- Python 3.11 or newer
- Node.js 18 or newer
- Git

If you don't have them:

| Tool | Link |
|------|------|
| Python | https://www.python.org/downloads/ |
| Node.js | https://nodejs.org/ |
| Git | https://git-scm.com/downloads |

---

## 📥 Download the Project

### Option 1 (Recommended) — Clone with Git

```bash
git clone https://github.com/Scoder0011/Mailer.git
cd Mailer
```

### Option 2 — Download ZIP

1. Click the green **Code** button on GitHub
2. Click **Download ZIP**
3. Extract it anywhere
4. Open the folder in VS Code

---

## 🚀 Running Mailer

Mailer consists of two parts — a **backend** (handles email sending) and a **frontend** (the website you interact with). **Both must be running** at the same time.

### Step 1 — Start the Backend

Open a terminal in VS Code and run:

```bash
cd backend
```

Create a virtual environment (Windows):

```bash
python -m venv venv
```

Activate it:

```bash
# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

If everything is working, you should see:

```
Uvicorn running on http://127.0.0.1:8000
```

**Leave this terminal open.**

### Step 2 — Start the Frontend

Open a **new** terminal and run:

```bash
cd frontend
npm install
npm run dev
```

You'll see something similar to:

```
Local: http://localhost:5173
```

Open that address in your browser.

---

## 🔐 Gmail Setup (Very Important)

Mailer sends emails using your Gmail account. Google does **NOT** allow applications to use your normal Gmail password — instead, you must create an **App Password**.

> ⚠️ **Do NOT use your regular Gmail password in Mailer.** Use an App Password only.

1. Go to https://myaccount.google.com
2. Click **Security**
3. Enable **2-Step Verification**
4. Search for **App Passwords**, or go directly to https://myaccount.google.com/apppasswords
5. Create a new App Password (example name: `Mailer`)
6. Google will generate a code like `abcd efgh ijkl mnop` — **copy it, you will only see it once**

Then inside Mailer, enter:

| Field | Value |
|-------|-------|
| Sender Email | `yourgmail@gmail.com` |
| App Password | `abcd efgh ijkl mnop` |

---

## 📄 Preparing the Recipient List

Mailer accepts **CSV** or **XLSX** files.

```csv
email,name,company
john@example.com,John Doe,Microsoft
alice@example.com,Alice,Google
```

- The `email` column is **required**
- The `name` and `company` columns are **optional**

---

## 🏷 Placeholders

You can personalize every email using placeholders.

**Example subject:**
```
Opportunity with {{company}}
```

**Example body:**
```
Hello {{name}},

Thank you for your time.

Regards,
Your Team
```

**Available placeholders:**

| Placeholder | Meaning |
|---|---|
| `{{name}}` | Recipient name |
| `{{company}}` | Company name |
| `{{email}}` | Recipient email |
| `{{recipient_name}}` | Recipient name |
| `{{recipient_company}}` | Company name |
| `{{recipient_email}}` | Recipient email |

---

## ✉ Sending Your First Email

**Always test before sending to hundreds of people.**

1. Create a CSV containing only your own email:

```csv
email,name,company
your@email.com,John Doe,Testing Company
```

2. Inside Mailer:
   - Enter your Gmail address
   - Enter your App Password
   - Write the subject
   - Write the email
   - Upload the CSV
   - Click **Send Test Email**

3. Check that:
   - Subject is correct
   - Name is replaced
   - Company is replaced
   - Attachment is included

Once everything looks good, upload your real recipient list.

---

## 📊 During a Campaign

You can **Start**, **Pause**, **Resume**, or **Stop** a campaign at any time.

After the campaign finishes, download the report.

---

## ⚠ Gmail Limits

Google limits how many emails you can send per day. For better reliability:

- Use a delay of **10–20 seconds** between sends
- Don't send hundreds of emails instantly
- Always test before large campaigns

---

## ❓ Frequently Asked Questions

**The test email failed.**
- Check your Gmail address
- Check your App Password
- Make sure 2-Step Verification is enabled

**My email says "Sent" but the recipient didn't receive it.**

The email was accepted by Gmail, but the recipient's mail server may have rejected it later. Check:
- Spam / Promotions folder
- Recipient address
- Domain restrictions

**Placeholders are not replaced.**

Use `{{name}}` — not `{name}`.

**Backend won't start.**
```bash
pip install -r requirements.txt
```

**Frontend won't start.**
```bash
npm install
```

---

## 📄 License

MIT License

## 👨‍💻 Author

**Suraj Chauhan**
GitHub: https://github.com/Scoder0011