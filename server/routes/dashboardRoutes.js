const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAppointmentsTrend,
  getDoctorPerformance,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/appointments-trend', protect, authorize('admin'), getAppointmentsTrend);
router.get('/doctor-performance', protect, authorize('admin'), getDoctorPerformance);

module.exports = router;