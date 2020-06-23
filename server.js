const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors({ origin: 'https://nullchar.now.sh' }));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

app.post('/api/contact', (req, res) => {
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const mailOpts = {
    from: req.body.email,
    to: GMAIL_USER,
    subject: 'New message from the contact form from https://nullchar.dev',
    text: `${req.body.name} (${req.body.email}) says: \n ${req.body.message}`,
  };

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      res.status(500).json({ message: `error` });
    } else {
      res.status(200).json({ message: 'success' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
