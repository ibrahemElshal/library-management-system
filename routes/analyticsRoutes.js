const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middlewares/authMiddleware');
const { dateRangeValidation } = require('../validators/analyticsValidator');

router.use(authenticate);

router.get('/export/csv', dateRangeValidation, analyticsController.exportBorrowDataCSV);
router.get('/export/xlsx', dateRangeValidation, analyticsController.exportBorrowDataXLSX);
router.get('/overdue/last-month', analyticsController.exportOverdueLastMonth);
router.get('/borrows/last-month', analyticsController.exportBorrowsLastMonth);

module.exports = router;
