const Patient = require('../models/Patient');

// @desc Get logged-in patient's own profile
// @route GET /api/patients/me
const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone'
    );
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update logged-in patient's own profile
// @route PUT /api/patients/me
const updateMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const fields = [
      'bloodGroup',
      'gender',
      'dob',
      'address',
      'emergencyContact',
      'allergies',
      'chronicDiseases',
      'height',
      'weight',
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all patients (admin/doctor)
// @route GET /api/patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('user', 'name email phone');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single patient by ID (admin/doctor)
// @route GET /api/patients/:id
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'user',
      'name email phone'
    );
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete patient (admin only)
// @route DELETE /api/patients/:id
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    await patient.deleteOne();
    res.json({ message: 'Patient removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPatients,
  getPatientById,
  deletePatient,
};