const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const nodemailer = require('nodemailer');
const booking = require('../api/bookcontact');
const contact = require('../api/contact');

function response() {
  return {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test('booking form sends the correct fields to the restaurant', async () => {
  const original = nodemailer.createTransport;
  const sent = [];
  nodemailer.createTransport = () => ({ sendMail: async (mail) => sent.push(mail) });
  process.env.SMTP_USER = 'sender@example.com';
  process.env.SMTP_PASS = 'test-only';
  try {
    const req = Readable.from(['name=Alex+Smith&email=alex%40example.com&phone=01179699777&person=2+Person&date=01-10-2026&time=7%3A00+pm&message=Window']);
    req.method = 'POST';
    const res = response();
    await booking(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(sent[0].to, 'booking@madrasbristol.com');
    assert.match(sent[0].html, /2 Person/);
    assert.match(sent[0].html, /01-10-2026/);
    assert.equal(sent[0].replyTo.address, 'alex@example.com');
  } finally {
    nodemailer.createTransport = original;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
  }
});

test('parsed Vercel body sends contact enquiry and escapes HTML', async () => {
  const original = nodemailer.createTransport;
  let mail;
  nodemailer.createTransport = () => ({ sendMail: async (value) => { mail = value; } });
  process.env.SMTP_USER = 'sender@example.com';
  process.env.SMTP_PASS = 'test-only';
  try {
    const res = response();
    await contact({ method: 'POST', body: { name: 'Alex', email: 'alex@example.com', phone: '12345678901', message: '<script>alert(1)</script>' } }, res);
    assert.equal(res.statusCode, 200);
    assert.match(mail.html, /&lt;script&gt;/);
    assert.doesNotMatch(mail.html, /<script>/);
  } finally {
    nodemailer.createTransport = original;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
  }
});

test('a booking without date does not send mail', async () => {
  const res = response();
  await booking({ method: 'POST', body: { name: 'Alex', email: 'alex@example.com', phone: '12345678901', person: '2', time: '7 pm' } }, res);
  assert.equal(res.statusCode, 400);
});
