const nodemailer = require('nodemailer');
const querystring = require('node:querystring');

const recipient = 'booking@madrasbristol.com';
const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

async function getFields(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return querystring.parse(req.body);
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 16_384) throw new Error('Request too large');
  }
  return querystring.parse(body);
}

async function handleEnquiry(req, res, booking) {
  if (req.method !== 'POST') return res.status(405).json({ type: 'danger', message: 'Method not allowed.' });

  let fields;
  try {
    fields = await getFields(req);
  } catch {
    return res.status(413).json({ type: 'danger', message: 'The request is too large.' });
  }
  const field = (key) => String(fields[key] || '').trim();
  const name = field('name');
  const email = field('email');
  const phone = field('phone');
  const message = field('message');
  const person = field('person');
  const date = field('date');
  const time = field('time');

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone ||
      (booking && (!person || !date || !time))) {
    return res.status(400).json({ type: 'danger', message: 'Please complete all required fields.' });
  }

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
  if (!user || !pass) {
    console.error('SMTP credentials are not configured');
    return res.status(503).json({ type: 'danger', message: 'Email is temporarily unavailable. Please call us to book.' });
  }

  const rows = [
    ['Name', name], ['Email', email], ['Phone', phone],
    ...(booking ? [['No of Persons', person], ['Date', date], ['Time', time]] : []),
    ['Message', message || 'N/A']
  ];
  const html = `<h3>${booking ? 'New Table Reservation Enquiry' : 'New Contact Enquiry'}</h3>` +
    rows.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value).replace(/\r?\n/g, '<br>')}</p>`).join('');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com', port: 465, secure: true,
      auth: { user, pass }
    });
    await transporter.sendMail({
      from: { name: 'Madras Bristol Website', address: user },
      to: recipient,
      replyTo: { name: name.replace(/[\r\n]/g, ' '), address: email },
      subject: booking ? 'New Reservation Enquiry - Madras Bristol' : 'New Contact Form Message - Madras Bristol',
      html
    });
    return res.status(200).json({ type: 'success', message: booking
      ? 'Your booking request was sent. We will confirm availability shortly.'
      : 'Your message was sent successfully.' });
  } catch (error) {
    console.error('SMTP delivery failed:', error);
    return res.status(502).json({ type: 'danger', message: 'Your request could not be sent. Please call us instead.' });
  }
}

module.exports = { handleEnquiry };
