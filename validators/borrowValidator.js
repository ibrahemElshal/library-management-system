const { body, param } = require('express-validator');

exports.checkoutValidation = [
    body('book_id').notEmpty().withMessage('Book ID is required').isInt(),
    body('borrower_id').notEmpty().withMessage('Borrower ID is required').isInt(),
    body('due_date').notEmpty().withMessage('Due date is required').isISO8601().toDate()
];

exports.returnValidation = [
    param('id').notEmpty().withMessage('Borrow ID is required').isInt()
];

exports.borrowerIdValidation = [
    param('borrower_id').notEmpty().withMessage('Borrower ID is required').isInt()
];
