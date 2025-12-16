const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const adminAuth = require('../middlewares/adminAuth');
const borrowerAuth=require('../middlewares/borrowerAuth');
const { dateRangeValidation } = require('../validators/analyticsValidator');

//router.use(authenticate);

router.get('/export/csv', adminAuth ,dateRangeValidation, analyticsController.exportBorrowDataCSV);
router.get('/export/xlsx', adminAuth ,dateRangeValidation, analyticsController.exportBorrowDataXLSX);
router.get('/overdue/last-month', adminAuth ,analyticsController.exportOverdueLastMonth);
router.get('/borrows/last-month', adminAuth ,analyticsController.exportBorrowsLastMonth);

module.exports = router;
