const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
// تحت سطر app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));

// الاتصال بقاعدة بيانات MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح!'))
  .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

app.get('/', (req, res) => {
  res.send('🚀 سيرفر منصة فيزياء المستقبل يعمل بنجاح');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على: http://localhost:${PORT}`);
});