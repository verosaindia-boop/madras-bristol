const nodemailer = require('nodemailer');
const querystring = require('querystring');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Parse form data (application/x-www-form-urlencoded)
  let body = '';
  await new Promise((resolve) => {
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', resolve);
  });
  const data = querystring.parse(body);

  const name = (data.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const email = (data.email || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const phone = (data.phone || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const message = (data.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

  const htmlBody = `
    <h3>New Contact Form Enquiry</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong><br>${message}</p>
  `;

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'info@madrasbristol.com',
      pass: process.env.SMTP_PASS || 'Madras@2026',
    },
  });

  try {
    await transporter.sendMail({
      from: '"Madras Bristol" <info@madrasbristol.com>',
      to: 'booking@madrasbristol.com',
      replyTo: `"${name}" <${email}>`,
      subject: 'New Contact Form Message - Madras Bristol',
      html: htmlBody,
    });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<script>
      alert('Thank you! Your message has been sent successfully.');
      window.location.href='/contact-us.html';
    </script>`);
  } catch (err) {
    console.error('Mail error:', err);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`<script>
      alert('Mail not sent. Please try again later.');
      window.location.href='/contact-us.html';
    </script>`);
  }
};
