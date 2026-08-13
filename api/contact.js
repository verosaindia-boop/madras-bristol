const nodemailer = require('nodemailer');

// Create transporter using Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'info@madrasbristol.com',
    pass: process.env.EMAIL_PASSWORD || 'Madras@2026'
  }
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message, person, date, time } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build email body based on form type
    let subject, body;
    
    if (date && time && person) {
      // Table reservation form
      subject = 'New Table Reservation / Contact Enquiry';
      body = `
        <h3>New Table Reservation / Contact Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>No of Persons:</strong> ${person}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Message:</strong><br>${message || 'N/A'}</p>
      `;
    } else {
      // Regular contact form
      subject = 'New Contact Form Message - Madras Bristol';
      body = `
        <h3>New Contact Form Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message || 'N/A'}</p>
      `;
    }

    // Send email
    await transporter.sendMail({
      from: 'info@madrasbristol.com',
      to: 'booking@madrasbristol.com',
      replyTo: email,
      subject: subject,
      html: body
    });

    return res.status(200).json({ 
      type: 'success', 
      message: 'Your message has been sent successfully!' 
    });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ 
      type: 'danger',
      message: 'Failed to send message. Please try again later.'
    });
  }
}
