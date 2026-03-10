# Fixonic Email Templates

Simple, branded HTML email templates for Fixonic. Use these in your backend (e.g. Nodemailer) by replacing placeholders and sending HTML.

**Brand colors:** Navy `#0A192F`, Lime `#99FF00`.

## Templates

| File | Use | Placeholders |
|------|-----|--------------|
| `verification-otp.html` | Email verification OTP | `{{OTP}}` – 6-digit code |
| `welcome.html` | After signup / verification | `{{name}}`, `{{loginUrl}}` |
| `password-reset.html` | Forgot password link | `{{name}}`, `{{resetUrl}}` |

## Backend usage (Node + Nodemailer)

```js
const fs = require('fs');
const path = require('path');

// Load template and replace placeholders
function getVerificationEmail(otp) {
  let html = fs.readFileSync(path.join(__dirname, 'verification-otp.html'), 'utf8');
  return html.replace(/\{\{OTP\}\}/g, otp);
}

function getWelcomeEmail(name, loginUrl) {
  let html = fs.readFileSync(path.join(__dirname, 'welcome.html'), 'utf8');
  return html.replace(/\{\{name\}\}/g, name).replace(/\{\{loginUrl\}\}/g, loginUrl);
}

function getPasswordResetEmail(name, resetUrl) {
  let html = fs.readFileSync(path.join(__dirname, 'password-reset.html'), 'utf8');
  return html.replace(/\{\{name\}\}/g, name).replace(/\{\{resetUrl\}\}/g, resetUrl);
}

// Send with Nodemailer
await transporter.sendMail({
  to: user.email,
  subject: 'Verify your email – Fixonic',
  html: getVerificationEmail('123456'),
});
```
