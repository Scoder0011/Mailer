📧 Mailer

A simple desktop web application for sending personalized emails to multiple recipients using your Gmail account.

Instead of sending the same email one by one, Mailer lets you:

Upload a list of recipients from Excel or CSV
Personalize each email automatically
Attach documents
Track sending progress
Download a report after the campaign finishes

Perfect for:

NGOs
Small businesses
Colleges
Clubs
Communities
Event organizers
Recruiters
Marketing teams

🖥 System Requirements

Before installing Mailer, make sure you have:

Windows 10/11, Linux or macOS
Python 3.11 or newer
Node.js 18 or newer
Git

If you don't have them:

Python → https://www.python.org/downloads/
Node.js → https://nodejs.org/
Git → https://git-scm.com/downloads
📥 Download the Project
Option 1 (Recommended)

Clone using Git.

git clone https://github.com/Scoder0011/Mailer.git

Move into the project.

cd Mailer
Option 2

Click the green Code button on GitHub.

Click

Download ZIP

Extract it anywhere.

Open the folder in VS Code.

🚀 Running Mailer

Mailer consists of two parts.

Backend (handles email sending)
Frontend (the website you interact with)

Both must be running.

Step 1 — Start the Backend

Open VS Code.

Open a terminal.

Move into the backend folder.

cd backend

Create a virtual environment.

Windows:

python -m venv venv

Activate it.

Windows

venv\Scripts\activate

Linux/macOS

source venv/bin/activate

Install the required packages.

pip install -r requirements.txt

Now start the backend.

uvicorn main:app --reload

If everything is working you should see

Uvicorn running on:

http://127.0.0.1:8000

Leave this terminal open.

Step 2 — Start the Frontend

Open another terminal.

Move into the frontend folder.

cd frontend

Install packages.

npm install

Start the frontend.

npm run dev

You will see something similar to

Local:

http://localhost:5173

Open that address in your browser.

🔐 Gmail Setup (Very Important)

Mailer sends emails using your Gmail account.

Google does NOT allow applications to use your normal Gmail password.

Instead, you must create an App Password.

Step 1

Open

https://myaccount.google.com

Step 2

Click

Security
Step 3

Enable

2-Step Verification
Step 4

Search for

App Passwords

or visit

https://myaccount.google.com/apppasswords

Step 5

Create a new App Password.

Example name:

Mailer

Google will generate something like

abcd efgh ijkl mnop

Copy it.

You will only see it once.

Step 6

Inside Mailer

Sender Email

yourgmail@gmail.com

App Password

abcd efgh ijkl mnop

Do NOT use your Gmail password.

📄 Preparing the Recipient List

Mailer accepts

CSV
XLSX

Example:

email,name,company
john@example.com,John Doe,Microsoft
alice@example.com,Alice,Google

The email column is required.

The name and company columns are optional.

🏷 Placeholders

You can personalize every email.

Example subject

Opportunity with {{company}}

Example body

Hello {{name}},

Thank you for your time.

Regards,
Your Team

Available placeholders

Placeholder	Meaning
{{name}}	Recipient name
{{company}}	Company name
{{email}}	Recipient email
{{recipient_name}}	Recipient name
{{recipient_company}}	Company name
{{recipient_email}}	Recipient email
✉ Sending Your First Email

Before sending to hundreds of people, always test.

Create a CSV containing only your own email.

Example

email,name,company
your@email.com,John Doe,Testing Company

Inside Mailer

Enter your Gmail address.
Enter your App Password.
Write the subject.
Write the email.
Upload the CSV.
Click Send Test Email.

Check that:

Subject is correct.
Name is replaced.
Company is replaced.
Attachment is included.

Once everything looks good, upload your real recipient list.

📊 During a Campaign

You can

Start
Pause
Resume
Stop

After the campaign finishes, download the report.

⚠ Gmail Limits

Google limits how many emails you can send every day.

For better reliability:

Use a delay of 10–20 seconds.
Don't send hundreds of emails instantly.
Test before large campaigns.
❓ Frequently Asked Questions
The test email failed.
Check your Gmail address.
Check your App Password.
Make sure 2-Step Verification is enabled.
My email says "Sent" but the recipient didn't receive it.

The email was accepted by Gmail.

The recipient's mail server may have rejected it later.

Check:

Spam
Promotions
Recipient address
Domain restrictions
Placeholders are not replaced.

Use

{{name}}

not

{name}
Backend won't start.

Run

pip install -r requirements.txt

again.

Frontend won't start.

Run

npm install

again.

📄 License

MIT License

👨‍💻 Author

Suraj Chauhan

GitHub: https://github.com/Scoder0011