const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const analyticsController = require('../controllers/analyticsController');
const adminAuth = require('../middlewares/adminAuth');
const { dateRangeValidation } = require('../validators/analyticsValidator');
const validateRequest = require('../middlewares/validateRequest');

// Admin management routes
router.post('/add', adminController.addAdmin);
router.post('/login', adminController.login);

// Analytics routes (admin only)
router.get('/analytics/export/csv', adminAuth, dateRangeValidation, validateRequest, analyticsController.exportBorrowDataCSV);
router.get('/analytics/export/xlsx', adminAuth, dateRangeValidation, validateRequest, analyticsController.exportBorrowDataXLSX);
router.get('/analytics/overdue/last-month', adminAuth, analyticsController.exportOverdueLastMonth);
router.get('/analytics/borrows/last-month', adminAuth, analyticsController.exportBorrowsLastMonth);

module.exports = router;
