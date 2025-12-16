const { query } = require('express-validator');

exports.dateRangeValidation = [
    query('startDate').notEmpty().withMessage('startDate is required').isISO8601().toDate(),
    query('endDate').notEmpty().withMessage('endDate is required').isISO8601().toDate(),
    (req, res, next) => {
        const { validationResult } = require('express-validator');
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { startDate, endDate } = req.query;
        if (new Date(startDate) > new Date(endDate))
            return res.status(400).json({ message: 'startDate must be before endDate' });

        next();
    }
];
