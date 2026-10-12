const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// إعدادات الـ Middleware
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة بيانات MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح!'))
  .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// الصفحة الرئيسية لفحص عمل السيرفر
app.get('/', (req, res) => {
  res.send('🚀 سيرفر منصة فيزياء المستقبل يعمل بنجاح');
});

// مسارات الـ API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// تشغيل السيرفر محلياً فقط وتجنب app.listen في بيئة Vercel Serverless
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل محلياً على: http://localhost:${PORT}`);
  });
}

// تصدير التطبيق ليعمل كـ Serverless Function على Vercel
module.exports = app;