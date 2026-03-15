
# Future Self Messenger

Send messages to your future self with scheduled email delivery. Built with vanilla HTML/CSS/JS frontend and Node.js backend.

## Features

- 📬 Send messages to your future self
- 💬 Leave feedback for the developer
- ⏰ Schedule messages for future dates/times
- 🌙 Light/Dark mode toggle
- 📧 Email delivery via SMTP
- 🎨 Modern, playful UI with Fredoka One font
- 💾 Fully responsive design
- 🔄 Automatic scheduled message delivery

## Project Structure

```
future-self-messenger/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── email.js
│   ├── routes/
│   │   └── messages.js
│   ├── jobs/
│   │   └── scheduler.js
├── .gitignore
└── README.md
```

## Backend Setup

### Prerequisites
- Node.js v14+
- npm or yarn
- Gmail account (for email sending)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash

npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Fill in your email credentials in `.env`:
```
PORT=5000
FRONTEND_URL=http://localhost:3000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
DEV_EMAIL=dev@example.com
```

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on your 

Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `.env` as `EMAIL_PASSWORD`

### Running the Backend

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## Frontend Setup

### Prerequisites

- Modern web browser
- Web server (for local testing)

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Update API_URL in `js/app.js` if backend is on different URL:
```javascript
const API_URL = 'http://localhost:5000/api';
```

3. Run a local server:
```bash
# Using Python 3
python -m http.server 3000

# Using Node.js
npx http-server -p 3000

# Using PHP
php -S localhost:3000
```

4. Open browser to `http://localhost:3000`

## API Endpoints

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

### Get All Messages (Admin)
```
GET /api/messages/all
```

### Health Check
```
GET /api/health

```

## Deployment

### Deploy Backend to Heroku

1. Create Heroku account and install CLI
2. Login:
```bash
heroku login
```

3. Create app:
```bash
heroku create your-app-name
```

4. Set environment variables:
```bash
heroku config:set EMAIL_USER=jtaumarake@gmail.com

heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set DEV_EMAIL=dev@example.com
heroku config:set FRONTEND_URL=https://your-frontend-url.com
```

5. Deploy:
```bash
git push heroku main
```

### Deploy Frontend to GitHub Pages

1. Push frontend folder to gh-pages branch
2. Go to Settings > Pages in your GitHub repo
3. Select `gh-pages` branch as source
4. Update `API_URL` in `js/app.js` to point to deployed backend


## echnology Stack

**Frontend:**
- HTML5
- CSS3 (with animations)
- Vanilla JavaScript (ES6+)
- Fredoka One font

**Backend:**
- Node.js + Express.js
- SQLite3 (database)
- Nodemailer (email)
- node-cron (scheduling)
- CORS

## Security Notes

- `.env` files are never committed (in .gitignore)
- Email passwords should use App 

Passwords, not real passwords
- CORS is configured to accept requests from frontend URL only
- No user authentication required
- Messages stored with timestamps for reference

## License

MIT License - feel free to fork and modify!

## Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## Support

For issues or questions:

1. Check existing issues on GitHub
2. Open a new issue with details
3. Leave a message via the app!

---