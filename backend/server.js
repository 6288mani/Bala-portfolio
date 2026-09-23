require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();

// ---- Middleware ----
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Prevent spam/abuse: max 5 submissions per IP every 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many messages sent. Please try again later.' },
});

// ---- Mail transporter ----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail "App Password"
  },
});

// Verify SMTP creds on boot
transporter.verify((err) => {
  if (err) console.error('❌ Mail transporter error:', err.message);
  else console.log('✅ Mail transporter ready');
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- Routes ----
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};

  // 1. Removed `phone` from this required check so it's optional
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }
  if (message.length > 500000) {
    return res.status(400).json({ success: false, error: 'Message is too long.' });
  }

  try {
    // 2. Conditionally generate the phone line for the email HTML only if phone exists
    const phoneHtmlField = phone && phone.trim() !== ''
      ? `<br>Phone: <a href="tel:${phone}">${phone}</a>`
      : '';

    // Notification email to you
    await transporter.sendMail({
      // Note: Gmail SMTP forces auth to be your user email, but this shows user name in inbox
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact Form - ${subject}`,
      html: `
        <h3>New message from your portfolio</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        Thanks & Regards,
        <p><strong>${name}</strong><br>
        Email: <a href="mailto:${email}">${email}</a>${phoneHtmlField}</p>
      `,
    });

    // Optional auto-reply to the sender
    await transporter.sendMail({
      from: `"Bala Venkata Mani Kumar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      text: `Hi ${name},\n\nThanks for your message — I received it and will get back to you soon.\n\nRegards,\nBala Venkata Mani Kumar,\nCloud & DevOps Consultant`,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));