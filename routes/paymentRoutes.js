const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// إنشاء رقم دفع فوري
router.post('/fawry/create-order', protect, async (req, res) => {
  try {
    const { chapterId, amount } = req.body;
    const userId = req.user.id;

    // توليد رقم مرجعي عشوائي من 10 أرقام
    const fawryRefNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // صلاحية الكود 48 ساعة
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 48);

    // إنشاء وحفظ الطلب
    const order = await Order.create({
      userId,
      chapterId,
      amount,
      paymentMethod: 'fawry',
      fawryRefNumber,
      status: 'pending',
      expireDate
    });

    res.json({
      message: 'تم إنشاء كود الدفع بنجاح',
      fawryRefNumber,
      expireDate,
      orderId: order._id
    });
  } catch (err) {
    console.error('Fawry Order Error:', err);
    res.status(500).json({ message: 'فشل إنشاء طلب فوري' });
  }
});

module.exports = router;