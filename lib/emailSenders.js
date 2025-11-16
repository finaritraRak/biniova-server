// lib/emailSenders.js
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

const FROM = process.env.FROM_EMAIL || 'no-reply@example.com';
const TO = process.env.TO_EMAIL || 'tech@biniova.com';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendWithSendGrid({subject, html, text, from = FROM, to = TO}) {
  if (!process.env.SENDGRID_API_KEY) throw new Error('SendGrid key not set');
  const msg = {
    to,
    from,
    subject,
    text,
    html
  };
  return sgMail.send(msg); // returns a promise
}

async function sendWithSMTP({subject, html, text, from = FROM, to = TO}) {
  if (!process.env.SMTP_HOST) throw new Error('SMTP not configured');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // use promise style (await)
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
}

async function sendContactEmail(payload) {
  const { name, email, phone, company, subject, services, message, budget, currency } = payload;
  const subj = subject || `Contact form: ${name}`;
  const text = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Services: ${services?.join ? services.join(', ') : services}
Budget: ${budget} ${currency}
Message:
${message}
  `;
  const html = `
    <h2>New contact request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Services:</strong> ${services?.join ? services.join(', ') : services}</p>
    <p><strong>Budget:</strong> ${budget} ${currency}</p>
    <hr/>
    <p>${message}</p>
  `;

  // Prefer SendGrid if configured
  if (process.env.SENDGRID_API_KEY) {
    return sendWithSendGrid({subject: subj, text, html});
  } else {
    // fallback to SMTP (must be configured)
    return sendWithSMTP({subject: subj, text, html});
  }
}

module.exports = { sendContactEmail, sendWithSendGrid, sendWithSMTP };
