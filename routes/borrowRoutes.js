const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const adminAuth = require('../middlewares/adminAuth');
const borrowerAuth = require('../middlewares/borrowerAuth')
const rateLimiter = require('../middlewares/rateLimiter');
const validateRequest = require('../middlewares/validateRequest');
const { checkoutValidation, returnValidation, borrowerIdValidation } = require('../validators/borrowValidator');

//router.use(authenticate);

router.post('/checkout', borrowerAuth, rateLimiter('checkoutBook', 5, 60), checkoutValidation, validateRequest, borrowController.checkoutBook);
router.put('/return/:id', borrowerAuth, returnValidation, validateRequest, borrowController.returnBook);
router.get('/borrowed/:borrower_id', adminAuth, borrowerIdValidation, validateRequest, borrowController.getBorrowedBooks);
router.get('/overdue', adminAuth, borrowController.getOverdueBooks);

module.exports = router;
