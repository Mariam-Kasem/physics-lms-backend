// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. التحقق من تسجيل الدخول
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'جلسة غير صالحة أو منتهية، يرجى تسجيل الدخول.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح بالدخول، لا يوجد توكن.' });
  }
};

// 2. التحقق من صلاحية الوصول للفصل (مفتوح / مدفوع)
const checkChapterAccess = (req, res, next) => {
  const chapterId = req.params.chapterId;
  const user = req.user;

  // إذا كان الحساب آدمن (المدرس) يتفتح له كل شيء تلقائياً
  if (user.role === 'admin') return next();

  // فحص هل الآيدي الخاص بالفصل موجود في قائمة اشتراكات الطالب
  const isSubscribed = user.subscribedChapters.some(
    (id) => id.toString() === chapterId
  );

  if (isSubscribed) {
    return next(); // مشترك بالفعل، يدخل للدرس
  }

  // إذا لم يكن مشتركاً، يتم منعه
  return res.status(403).json({
    message: '🔒 هذا المحتوى خاص بالمشتركين فقط في هذا الفصل. يرجى الاشتراك لفتح المحاضرات والامتحانات.'
  });
};

module.exports = { protect, checkChapterAccess };