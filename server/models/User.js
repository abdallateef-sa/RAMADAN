const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  salah: {
    fajr: { type: Boolean, default: false },
    dhuhr: { type: Boolean, default: false },
    asr: { type: Boolean, default: false },
    maghrib: { type: Boolean, default: false },
    isha: { type: Boolean, default: false },
    rawatib: { type: Boolean, default: false },
    duha: { type: Boolean, default: false },
    qiyam: { type: Boolean, default: false }
  },
  azkar: {
    morning: { type: Boolean, default: false },
    evening: { type: Boolean, default: false },
    general: { type: Boolean, default: false }
  },
  quran: {
    recitation: { type: Boolean, default: false },
    reflection: { type: Boolean, default: false },
    listening: { type: Boolean, default: false }
  },
  goodDeeds: {
    charity: { type: Boolean, default: false },
    kinship: { type: Boolean, default: false },
    makeHappy: { type: Boolean, default: false },
    iftar: { type: Boolean, default: false }
  }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: String,
  otpExpires: Date,
  schedule: [DaySchema]
});

module.exports = mongoose.model('User', UserSchema);
