const express = require('express');
const router = express.Router();
const {
  createMedicalRecord,
  getMyMedicalRecords,
  getPatientRecordsForDoctor,
} = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.post('/', protect, authorize('doctor'), upload.array('testReports', 5), createMedicalRecord);
router.get('/my', protect, authorize('patient'), getMyMedicalRecords);
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), getPatientRecordsForDoctor);

module.exports = router;