const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true }, // e.g. "Consultation Fee", "Blood Test"
    category: {
      type: String,
      enum: ['consultation', 'medicine', 'test', 'other'],
      default: 'other',
    },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    items: [billItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', null],
      default: null,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);