const express = require('express');
const router = express.Router();
const { createBill, getMyBills, getAllBills, markBillPaid } = require('../controllers/billController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'doctor'), createBill);
router.get('/my', protect, authorize('patient'), getMyBills);
router.get('/', protect, authorize('admin'), getAllBills);
router.put('/:id/pay', protect, authorize('patient', 'admin'), markBillPaid);

module.exports = router;