require('dotenv').config();

const express = require('express');
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const nodemailer = require('nodemailer');
const nodemailerMailjet = require('nodemailer-mailjet-transport');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2
});

const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 3 * 1024 * 1024
  }
});

const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await axios.post(url);
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error.response.data);
    return false;
  }
};

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/submit-form', upload.array('photos', 5), async (req, res) => {
  const {name, email, token} = req.body;
  const photos = req.files;

  const isRecaptchaValid = await verifyRecaptcha(token);

  if (!isRecaptchaValid) {
    return res.status(400).send('reCAPTCHA verification failed');
  }

  const transporter = nodemailer.createTransport(nodemailerMailjet({
    auth: {
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET
    }
  }));

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: process.env.EMAIL_SUBJECT,
    text: `
            Ime: ${name}
            Email: ${email}
        `,
    attachments: []
  };

  photos.forEach((photo, index) => {
    const photoData = `data:${photo.mimetype};base64,${photo.buffer.toString('base64')}`;
    mailOptions.attachments.push({
      path: photoData,
      cid: `photo_${index + 1}`
    });
  });

  try {
    transporter.sendMail(mailOptions);
    res.status(200).send('Form submitted successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Something went wrong');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
