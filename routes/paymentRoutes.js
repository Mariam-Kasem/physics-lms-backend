const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

// إنشاء رقم دفع فوري
router.post('/fawry/create-order', authMiddleware, async (req, res) => {
  try {
    const { chapterId, amount } = req.body;
    const userId = req.user.id;

    // في البيئة الحقيقية: نرسل طلب لـ Fawry API أو Paymob API للحصول على الرقم المرجعي
    // في مرحلة التطوير (Development/Test): نولد رقماً مرجعياً عشوائياً من 10 أرقام
    const fawryRefNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    // صلاحية الكود (مثلاً 48 ساعة)
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 48);

    const newOrder = await Order.create({
      userId,
      chapterId,
      amount,
      fawryRefNumber,
      paymentStatus: 'PENDING',
      expireAt: expireDate
    });

    res.json({
      success: true,
      referenceNumber: fawryRefNumber,
      expireDate: expireDate.toLocaleString('ar-EG'),
      fawryCode: '788', // كود خدمة فوري باي الشهير
      amount
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء توليد كود الدفع' });
  }
});

// الـ Webhook / Callback الذي يناديه سيرفر فوري تلقائياً عند إتمام الدفع
router.post('/fawry/callback', async (req, res) => {
  try {
    const { referenceNumber, status } = req.body; // البيانات المرسلة من فوري

    if (status === 'PAID' || status === 'SUCCESS') {
      const order = await Order.findOne({ fawryRefNumber: referenceNumber });
      if (order && order.paymentStatus !== 'PAID') {
        order.paymentStatus = 'PAID';
        await order.save();

        // فتح الفصل تلقائياً في حساب الطالب
        const User = require('../models/User');
        await User.findByIdAndUpdate(order.userId, {
          $addToSet: { subscribedChapters: order.chapterId }
        });
      }
    }

    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Error');
  }
});

module.exports = router;