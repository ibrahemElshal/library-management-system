const { body } = require('express-validator');

exports.borrowerCreateValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Email must be valid')
];

exports.borrowerUpdateValidation = [
    body('name').optional().isString(),
    body('email').optional().isEmail()
];