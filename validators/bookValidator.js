const { body, query } = require('express-validator');

exports.bookCreateValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('isbn').isISBN().withMessage('ISBN must be valid'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be >= 0'),
    body('shelf_location').optional().isString().withMessage('Shelf location must be a string')
];

exports.bookUpdateValidation = [
    body('title').optional().isString(),
    body('author').optional().isString(),
    body('isbn').optional().isISBN(),
    body('quantity').optional().isInt({ min: 0 }),
    body('shelf_location').optional().isString()
];

exports.bookSearchValidation = [
    query('query')
        .trim()
        .notEmpty().withMessage('Search query is required')
        .isString().withMessage('Search query must be a string')
        .isLength({ min: 2, max: 100 })
        .withMessage('Search query must be between 2 and 100 characters')
];

