const nodemailer = require('nodemailer');

// Create transporter (using Gmail or your email service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email transporter ready');
  }
});

const sendToDevEmail = async (message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.DEV_EMAIL,
    subject: '📬 New Message via Future Self Messenger',
    html: `
      <h2>New Message from User</h2>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Sent via Future Self Messenger
      </p>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendScheduledMessage = async (email, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '✨ Message from Your Past Self',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0;">
          <h1>✨ Message from Your Past Self ✨</h1>
        </div>
        
        <p>Hey! Remember when you sent this to yourself?</p>
        
        <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="font-style: italic; font-size: 16px; line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </p>
        </div>
        
        <p>Hope you're doing well! 🚀</p>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          Sent via Future Self Messenger<br>
          Keep sending messages to yourself!
        </p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendToDevEmail,
  sendScheduledMessage
};