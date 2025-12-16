const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const adminAuth = require('../middlewares/adminAuth');
const borrowerAuth=require('../middlewares/borrowerAuth')
const rateLimiter = require('../middlewares/rateLimiter');
const { checkoutValidation, returnValidation, borrowerIdValidation } = require('../validators/borrowValidator');

//router.use(authenticate);

router.post('/checkout', rateLimiter('checkoutBook', 5, 60), checkoutValidation, borrowController.checkoutBook);
router.put('/return/:id', borrowerAuth,returnValidation, borrowController.returnBook);
router.get('/borrowed/:borrower_id', adminAuth,borrowerIdValidation, borrowController.getBorrowedBooks);
router.get('/overdue', adminAuth,borrowController.getOverdueBooks);

module.exports = router;
