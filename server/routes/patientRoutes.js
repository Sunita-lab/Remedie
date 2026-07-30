const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getPatients,
  getPatientById,
  deletePatient,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, authorize('patient'), getMyProfile);
router.put('/me', protect, authorize('patient'), updateMyProfile);

router.get('/', protect, authorize('admin', 'doctor'), getPatients);
router.get('/:id', protect, authorize('admin', 'doctor'), getPatientById);
router.delete('/:id', protect, authorize('admin'), deletePatient);

module.exports = router;