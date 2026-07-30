const User = require('../models/User');
const Doctor = require('../models/Doctor');

// @desc Admin creates a new doctor (User + Doctor profile together)
// @route POST /api/doctors
const createDoctor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      availableDays,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: fullName,
      email,
      password,
      role: 'doctor',
      phone,
    });

    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      qualification,
      experience,
      consultationFee,
      availableDays,
    });

    res.status(201).json({ user, doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all doctors (optionally filter by specialization)
// @route GET /api/doctors
const getDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;

    const filter = {};
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }

    const doctors = await Doctor.find(filter).populate('user', 'name email phone');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single doctor by ID
// @route GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update doctor profile
// @route PUT /api/doctors/:id
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const fields = [
      'specialization',
      'qualification',
      'experience',
      'consultationFee',
      'availableDays',
      'isAvailable',
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete doctor (and linked user account)
// @route DELETE /api/doctors/:id
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await User.findByIdAndDelete(doctor.user);
    await doctor.deleteOne();

    res.json({ message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};