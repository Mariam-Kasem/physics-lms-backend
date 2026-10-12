const express = require('express');
const router = express.Router();
const User = require('../models/User'); // استدعاء موديل المستخدم
const authMiddleware = require('../middleware/authMiddleware'); // الميدلوير للتحقق من التوكن
// مسار الاشتراك في فصل محدد
router.post('/:chapterId/subscribe', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { chapterId } = req.params;

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // التأكد من أن الطالب لم يشترك في الفصل من قبل
    if (!user.subscribedChapters.includes(chapterId)) {
      user.subscribedChapters.push(chapterId);
      await user.save();
    }

    res.json({
      message: "تم الاشتراك في الفصل بنجاح",
      subscribedChapters: user.subscribedChapters
    });
  } catch (err) {
    console.error("Subscription Error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء الاشتراك" });
  }
});

module.exports = router;