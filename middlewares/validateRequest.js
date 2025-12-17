const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation results from express-validator.
 * Checks for validation errors and returns a 400 response with errors array if any exist.
 * 
 * 
 */

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
