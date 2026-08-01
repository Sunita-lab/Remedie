const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');

// @desc Get admin dashboard stats
// @route GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const availableDoctors = await Doctor.countDocuments({ isAvailable: true });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });

    const revenueResult = await Bill.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      totalDoctors,
      totalPatients,
      todaysAppointments,
      totalRevenue,
      pendingAppointments,
      availableDoctors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get appointments trend (last 7 days)
// @route GET /api/dashboard/appointments-trend
const getAppointmentsTrend = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trend = await Appointment.aggregate([
      { $match: { appointmentDate: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(trend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Doctor performance (appointment count per doctor)
// @route GET /api/dashboard/doctor-performance
const getDoctorPerformance = async (req, res) => {
  try {
    const performance = await Appointment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$doctor', consultations: { $sum: 1 } } },
      { $sort: { consultations: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo',
        },
      },
      { $unwind: '$doctorInfo' },
      {
        $lookup: {
          from: 'users',
          localField: 'doctorInfo.user',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          name: '$userInfo.name',
          specialization: '$doctorInfo.specialization',
          consultations: 1,
        },
      },
    ]);

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAppointmentsTrend,
  getDoctorPerformance,
};