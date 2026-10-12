const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true }, // مثال: الفصل الأول - التيار الكهربي وقانون أوم
  description: { type: String },
  price: { type: Number, required: true, default: 150 }, // سعر الاشتراك بالجنية
  lessons: [
    {
      title: String,
      videoUrl: String,
      duration: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);