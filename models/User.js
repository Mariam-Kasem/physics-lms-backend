const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true, // رقم الهاتف لا يتكرر
    trim: true
  },
  parentPhone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'parent'],
    default: 'student'
  },
  grade: {
    type: String,
    default: 'الصف الثالث الثانوي'
  },
  governorate: {
    type: String,
    default: 'القاهرة'
  },
  code: {
    type: String,
    unique: true
  },
  // هنا الفصول التي دفع الطالب اشتراكها ومفتوحة له
  subscribedChapters: [
    {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    }
  ]
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);