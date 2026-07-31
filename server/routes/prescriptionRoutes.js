const express = require('express');
const router = express.Router();
const { createPrescription, getMyPrescriptions } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/my', protect, authorize('patient'), getMyPrescriptions);

module.exports = router;