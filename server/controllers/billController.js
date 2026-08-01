const Bill = require('../models/Bill');
const Patient = require('../models/Patient');

// @desc Admin/Doctor generates a bill
// @route POST /api/bills
const createBill = async (req, res) => {
  try {
    const { patientId, appointmentId, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'At least one bill item is required' });
    }

    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

    const bill = await Bill.create({
      patient: patientId,
      appointment: appointmentId || undefined,
      items,
      totalAmount,
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in patient's own bills
// @route GET /api/bills/my
const getMyBills = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const bills = await Bill.find({ patient: patient._id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all bills (admin)
// @route GET /api/bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark a bill as paid
// @route PUT /api/bills/:id/pay
const markBillPaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    bill.paymentStatus = 'paid';
    bill.paymentMethod = paymentMethod;
    bill.paidAt = new Date();
    await bill.save();

    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBill,
  getMyBills,
  getAllBills,
  markBillPaid,
};