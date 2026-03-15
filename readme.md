# Future Self Messenger ✨

[![Node.js](https://img.shields.io/badge/Node.js-v18-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.39-purple)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Send messages to your future self with scheduled email delivery. Built with vanilla HTML/CSS/JS frontend and Node.js/Express backend powered by Supabase.

## 🚀 Quick Start

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev  # http://localhost:5000

# Terminal 2: Frontend
cd frontend
python -m http.server 3000  # or npx http-server
# Open http://localhost:3000
```

## ✨ Features

- 📬 Send messages to your future self
- 💬 Leave feedback for the developer
- ⏰ Schedule messages for future dates/times
- 🌙 Light/Dark mode toggle
- 📧 Email delivery via SMTP/Nodemailer
- 🎨 Modern, playful UI with Fredoka One font
- 💾 Fully responsive design
- 🔄 Automatic scheduled message delivery via cron
- 🛢️ Supabase PostgreSQL database
- ✅ Health checks and API testing endpoints

## 📸 Screenshots

### Homepage
![Homepage Light Mode](screenshots/homepage-light.png)
![Homepage Dark Mode](screenshots/homepage-dark.png)

### Send to Future Self Form
![Future Self Form](screenshots/future-self-form.png)

### Developer Feedback
![Dev Feedback](screenshots/dev-feedback.png)

*To add screenshots: Run the app locally, take browser screenshots of key pages, save to `/screenshots/` folder.*

## 🗂️ Project Structure

```
future-massenger/
├── frontend/
│   ├── index.html
│   ├── message-input.html
│   ├── styles.css
│   └── js/
│       ├── app.js
│       ├── home.js
│       └── message-input.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   │   ├── email.js
│   │   └── readme.md
│   ├── routes/
│   │   └── messages.js
│   └── jobs/
│       └── scheduler.js
├── .gitignore
├── TODO.md
└── readme.md
```

## 🔧 Backend Setup

### Prerequisites
- Node.js v18+
- npm
- Supabase account/project
- Gmail (for emails)

### Installation
1. ```bash
   cd backend
   npm install
   ```

2. **Supabase Setup**:
   - Create project at [supabase.com](https://supabase.com)
   - Create `messages` table (or auto via app):
     ```sql
     CREATE TABLE messages (
       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
       content TEXT NOT NULL,
       email TEXT,
       scheduled_at TIMESTAMP,
       sent_at TIMESTAMP,
       status TEXT DEFAULT 'pending',
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env`

3. **Email Config** (`.env`):
   ```
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   EMAIL_SERVICE=gmail
   EMAIL_USER=your@gmail.com
   EMAIL_PASSWORD=app_password
   DEV_EMAIL=dev@example.com
   ```

4. Gmail App Password: [Generate here](https://myaccount.google.com/apppasswords)

### Run Backend
```bash
npm run dev  # nodemon
# or
npm start
```

## 🌐 Frontend Setup
Pure static files - no build step!

1. Update `js/app.js` API_URL if needed:
   ```js
   const API_URL = 'http://localhost:5000/api';
   ```

2. Serve:
   ```bash
   cd frontend
   npx http-server -p 3000  # or python -m http.server 3000
   ```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/messages/send-immediate` | Send now |
| `POST` | `/api/messages/send-scheduled` | Schedule future |
| `GET` | `/api/messages/all` | List all (admin) |
| `GET` | `/api/health` | Server status |
| `GET` | `/api/test-connection` | Supabase check |

Example (curl):
```bash
curl -X POST http://localhost:5000/api/messages/send-immediate \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello future!"}'
```

## ☁️ Deployment

### Backend (Railway/Render/Supabase Edge Functions)
1. Push to GitHub.
2. Connect to [Railway](https://railway.app).
3. Set env vars.
4. `npm start` as start cmd.

### Frontend (Vercel/Netlify/GitHub Pages)
1. Drag `frontend/` folder or push to `gh-pages`.
2. Set root dir to `/frontend`.
3. Update API_URL to production backend.

Heroku (legacy):
```bash
heroku config:set SUPABASE_URL=...  # etc.
git push heroku main
```

## 🛠️ Technology Stack

**Frontend:**
- HTML5, CSS3 (animations), Vanilla JS (ES6+)
- Fredoka One (Google Fonts)

**Backend:**
- Node.js + Express.js
- Supabase (PostgreSQL + Auth)
- Nodemailer (email)
- node-cron (scheduling)
- dotenv, CORS

## 🔒 Security
- `.env` gitignored
- App passwords for email
- CORS restricted to frontend origin
- No auth needed (public app)

## 📄 License
MIT License - Fork away!

## 🤝 Contributing
- Report issues/PRs welcome
- Add features (e.g., auth, multiple recipients)

## 💬 Support
Use the app's dev feedback form!

---

*Built by Tau J. Marake*

