const Borrower = require('../models/borrower');
const { sanitizeString } = require('../helpers/sanitize');
const { validationResult } = require('express-validator');

exports.addBorrower = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email } = req.body;

        const borrower = await Borrower.create({
            name: sanitizeString(name),
            email: sanitizeString(email)
        });

        res.status(201).json(borrower);

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

exports.updateBorrower = async (req, res) => {
    try {
        const borrower = await Borrower.findByPk(req.params.id);
        if (!borrower) return res.status(404).json({ message: 'Borrower not found' });

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email } = req.body;

        await borrower.update({
            name: name ? sanitizeString(name) : borrower.name,
            email: email ? sanitizeString(email) : borrower.email
        });

        res.json(borrower);

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBorrower = async (req, res) => {
    try {
        const borrower = await Borrower.findByPk(req.params.id);
        if (!borrower) return res.status(404).json({ message: 'Borrower not found' });

        await borrower.destroy();
        res.json({ message: 'Borrower deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};
exports.getAllBorrowers = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = page ? parseInt(page) : 1;      // Default page = 1
        limit = limit ? parseInt(limit) : 10;   // Default limit = 10
        const offset = (page - 1) * limit;

        const { count, rows } = await Borrower.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            borrowers: rows
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
