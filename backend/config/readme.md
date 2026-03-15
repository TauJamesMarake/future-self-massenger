# Future Self Messenger - Backend (Supabase)

Node.js + Express + Supabase backend for Future Self Messenger.

## 📋 Prerequisites

- Node.js v14+
- npm or yarn
- Supabase account (free tier available at https://supabase.com)
- Gmail account (for email sending)

## 🚀 Setup Instructions

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to initialize

#### Create Messages Table
1. Go to SQL Editor in Supabase
2. Run this SQL to create the messages table:

```sql
CREATE TABLE messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  scheduled_date TEXT,
  scheduled_time TEXT,
  scheduled_datetime TEXT,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX messages_sent_idx ON messages(sent);
CREATE INDEX messages_scheduled_datetime_idx ON messages(scheduled_datetime);
```

#### Get Your Credentials
1. Go to Settings > API
2. Copy your:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

### 2. Email Configuration (Gmail)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Find "App passwords"
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. Save this password → `EMAIL_PASSWORD` in `.env`

### 3. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Create .env File
```bash
cp .env.example .env
```

#### Fill in .env
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase (from Settings > API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
DEV_EMAIL=dev@example.com
```

#### Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

#### Test Connection
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/test-connection
```

## 📚 API Endpoints

### Send Message Immediately
```
POST /api/messages/send-immediate
Content-Type: application/json

{
  "message": "Your message here"
}
```

### Schedule Message
```
POST /api/messages/send-scheduled
Content-Type: application/json

{
  "message": "Your message here",
  "email": "user@example.com",
  "scheduledDate": "2025-12-31",
  "scheduledTime": "18:00"
}
```

### Get All Messages
```
GET /api/messages/all
```

### Get Unsent Messages
```
GET /api/messages/unsent
```

### Mark Message as Sent
```
PATCH /api/messages/mark-sent/:id
```

### Health Check
```
GET /api/health
```

### Test Supabase Connection
```
GET /api/test-connection
```

## 🚀 Deployment to Heroku

### 1. Install Heroku CLI
```bash
npm install -g heroku
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
heroku create your-app-name
```

### 4. Set Environment Variables
```bash
heroku config:set SUPABASE_URL=your-supabase-url
heroku config:set SUPABASE_ANON_KEY=your-anon-key
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set DEV_EMAIL=dev@example.com
heroku config:set FRONTEND_URL=https://your-frontend-url.com
heroku config:set NODE_ENV=production
```

### 5. Deploy
```bash
git push heroku main
```

### 6. View Logs
```bash
heroku logs --tail
```

## 📁 File Structure

```
backend/
├── server.js                 # Main Express server
├── package.json              # Dependencies
├── .env.example             # Environment template
├── config/
│   └── email.js             # Email configuration
├── routes/
│   └── messages.js          # Message API routes
├── jobs/
│   └── scheduler.js         # Scheduled message sender
└── README.md
```

## 🔧 How It Works

1. **User sends message** → POST to `/api/messages/send-scheduled` or `/send-immediate`
2. **Message saved** → Stored in Supabase `messages` table
3. **Scheduler runs** → Every minute, checks for messages to send
4. **Email sent** → Via Nodemailer to user or developer
5. **Mark as sent** → Update `sent = true` in database

## 📧 Email Variables

The email templates use these variables:
- `message` - The user's message
- `email` - User's email address (for scheduled messages)
- `DEV_EMAIL` - Developer's email (from .env)

## 🆘 Troubleshooting

### "Cannot connect to Supabase"
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Verify the project is initialized in Supabase dashboard
- Run `/api/test-connection` to diagnose

### "Email not sending"
- Verify Gmail app password is correct (not your Google password)
- Check 2FA is enabled on your Google account
- Make sure "Less secure app access" is not blocking (Gmail should ask for app password)

### "Messages not sending at scheduled time"
- Check server is running and scheduler logs show "Scheduler started"
- Verify `scheduled_datetime` format is correct: "YYYY-MM-DD HH:MM"
- Check timezone differences (server uses UTC)

### "Port already in use"
- Change `PORT` in `.env` to a different number (e.g., 5001)

## 📊 Database Schema

```sql
messages table:
- id: BIGINT (PK)
- type: TEXT ('future-self' or 'developer')
- message: TEXT
- email: TEXT (null for developer messages)
- scheduled_date: TEXT (YYYY-MM-DD)
- scheduled_time: TEXT (HH:MM)
- scheduled_datetime: TEXT (YYYY-MM-DD HH:MM)
- sent: BOOLEAN
- sent_at: TIMESTAMP
- created_at: TIMESTAMP
```

## 🔐 Security Notes

- Never commit `.env` file (already in .gitignore)
- Use app-specific passwords for email, not your real password
- Supabase uses row-level security (RLS) - consider enabling for production
- CORS is restricted to `FRONTEND_URL` only

## ✅ Checklist Before Going Live

- [ ] Supabase project created and messages table set up
- [ ] `.env` file filled with all credentials
- [ ] Email sending tested (send a message to yourself)
- [ ] Scheduler tested (check server logs)
- [ ] Frontend updated to point to deployed backend URL
- [ ] Deployed to Heroku or production server
- [ ] Test end-to-end flow from frontend through email