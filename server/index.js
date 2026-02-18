require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Routes

// Request Login OTP
app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    let user = await User.findOne({ email });
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (!user) {
      // Create new user with 30 days schedule
      const schedule = [];
      for (let i = 1; i <= 30; i++) {
        schedule.push({ 
          day: i, 
          salah: {}, azkar: {}, quran: {}, goodDeeds: {} 
        });
      }
      user = new User({ email, schedule, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }
    
    await user.save();

    // Send Email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Ramadan Planner Login Code',
        text: `Your login code is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ msg: 'Error sending email' });
        }
        res.json({ msg: 'OTP sent to email' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Verify OTP
app.post('/api/verify', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { email: user.email, schedule: user.schedule } });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Middleware
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

// Update Day Data
app.post('/api/schedule/update', auth, async (req, res) => {
    const { day, category, item, value } = req.body;
    // expect category: 'salah', item: 'fajr', value: true/false
    
    try {
        const user = await User.findById(req.user.id);
        const dayEntry = user.schedule.find(d => d.day === day);
        
        if (!dayEntry) return res.status(404).json({ msg: 'Day not found' });

        if (category && item) {
            if (!dayEntry[category]) dayEntry[category] = {};
            dayEntry[category][item] = value;
        } 
        
        await user.save();
        res.json(user.schedule);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get User Data (if session persists)
app.get('/api/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-otp -otpExpires');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
