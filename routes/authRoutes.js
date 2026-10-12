const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  try {
    const { name, phone, parentPhone, password, grade, governorate } = req.body;

    if (!name || !phone || !parentPhone || !password) {
      return res.status(400).json({ message: 'يرجى إرسال جميع الحقول المطلوبة.' });
    }

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'رقم الهاتف هذا مسجل به حساب بالفعل.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const studentCode = 'PHY-' + Math.floor(100000 + Math.random() * 900000);

    const user = await User.create({
      name,
      phone,
      parentPhone,
      password: hashedPassword,
      grade: grade || 'الصف الثالث الثانوي',
      governorate: governorate || 'القاهرة',
      code: studentCode,
      subscribedChapters: []
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      code: user.code,
      subscribedChapters: user.subscribedChapters,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration Error Details:', error);
    return res.status(500).json({ message: error.message || 'حدث خطأ في السيرفر أثناء التسجيل' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'رقم الهاتف أو كلمة المرور غير صحيحة.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'رقم الهاتف أو كلمة المرور غير صحيحة.' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      code: user.code,
      grade: user.grade,
      governorate: user.governorate,
      subscribedChapters: user.subscribedChapters,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login Error Details:', error);
    return res.status(500).json({ message: 'حدث خطأ في السيرفر', error: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب بيانات البروفايل' });
  }
});

module.exports = router;