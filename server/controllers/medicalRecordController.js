const MedicalRecord = require('../models/MedicalRecord');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc Doctor creates a medical record
// @route POST /api/medical-records
const createMedicalRecord = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const { patientId, appointmentId, symptoms, diagnosis, notes, followUpDate } = req.body;

    const testReports = req.files
      ? req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
        }))
      : [];

    const record = await MedicalRecord.create({
      patient: patientId,
      doctor: doctor._id,
      appointment: appointmentId || undefined,
      symptoms,
      diagnosis,
      notes,
      followUpDate,
      testReports,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in patient's own medical records
// @route GET /api/medical-records/my
const getMyMedicalRecords = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const records = await MedicalRecord.find({ patient: patient._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Doctor views records they created for a specific patient
// @route GET /api/medical-records/patient/:patientId
const getPatientRecordsForDoctor = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedicalRecord,
  getMyMedicalRecords,
  getPatientRecordsForDoctor,
};