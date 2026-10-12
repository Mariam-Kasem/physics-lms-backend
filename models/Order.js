const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapterId: { type: String, required: true },
  amount: { type: Number, required: true },
  fawryRefNumber: { type: String, required: true }, // الرقم المرجعي لفوري
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'EXPIRED'], 
    default: 'PENDING' 
  },
  expireAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);