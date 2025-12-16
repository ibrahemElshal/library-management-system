const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authenticate = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');
const { checkoutValidation, returnValidation, borrowerIdValidation } = require('../validators/borrowValidator');

router.use(authenticate);

router.post('/checkout', rateLimiter('checkoutBook', 5, 60), checkoutValidation, borrowController.checkoutBook);
router.post('/return/:id', returnValidation, borrowController.returnBook);
router.get('/borrowed/:borrower_id', borrowerIdValidation, borrowController.getBorrowedBooks);
router.get('/overdue', borrowController.getOverdueBooks);

module.exports = router;
