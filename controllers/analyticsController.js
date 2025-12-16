const Borrow = require('../models/borrow');
const Book = require('../models/book');
const Borrower = require('../models/borrower');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

/**
 * ===============================
 * Helpers (Security First)
 * ===============================
 */

// Prevent CSV Injection
const sanitizeCSVValue = (value) => {
    if (typeof value === 'string' && /^[=+\-@]/.test(value)) {
        return `'${value}`;
    }
    return value;
};

// Validate and parse date safely
const parseDate = (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    return date;
};

// Build safe response object
const mapBorrow = (b) => ({
    borrow_id: b.id,
    borrower_name: sanitizeCSVValue(b.Borrower.name),
    borrower_email: sanitizeCSVValue(b.Borrower.email),
    book_title: sanitizeCSVValue(b.Book.title),
    book_isbn: sanitizeCSVValue(b.Book.isbn),
    borrow_date: b.borrow_date,
    due_date: b.due_date,
    return_date: b.return_date
});



/**
 * ===============================
 * Export borrows in date range (CSV)
 * ===============================
 */
exports.exportBorrowDataCSV = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // ✅ Input validation
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate are required' });
        }

        const start = parseDate(startDate);
        const end = parseDate(endDate);

        if (start > end) {
            return res.status(400).json({ message: 'startDate must be before endDate' });
        }

        const borrows = await Borrow.findAll({
            where: {
                borrow_date: { [Op.between]: [start, end] }
            },
            include: [Book, Borrower]
        });

        const data = borrows.map(mapBorrow);

        const parser = new Parser();
        const csv = parser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=borrows_${startDate}_${endDate}.csv`
        );

        return res.status(200).send(csv);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



/**
 * ===============================
 * Export borrows in date range (XLSX)
 * ===============================
 */
exports.exportBorrowDataXLSX = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate are required' });
        }

        const start = parseDate(startDate);
        const end = parseDate(endDate);

        if (start > end) {
            return res.status(400).json({ message: 'startDate must be before endDate' });
        }

        const borrows = await Borrow.findAll({
            where: {
                borrow_date: { [Op.between]: [start, end] }
            },
            include: [Book, Borrower]
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Borrows');

        sheet.columns = [
            { header: 'Borrow ID', key: 'borrow_id', width: 10 },
            { header: 'Borrower Name', key: 'borrower_name', width: 25 },
            { header: 'Borrower Email', key: 'borrower_email', width: 30 },
            { header: 'Book Title', key: 'book_title', width: 30 },
            { header: 'Book ISBN', key: 'book_isbn', width: 20 },
            { header: 'Borrow Date', key: 'borrow_date', width: 20 },
            { header: 'Due Date', key: 'due_date', width: 20 },
            { header: 'Return Date', key: 'return_date', width: 20 }
        ];

        borrows.map(mapBorrow).forEach(row => sheet.addRow(row));

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=borrows_${startDate}_${endDate}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



/**
 * ===============================
 * Export overdue borrows (last month)
 * ===============================
 */
exports.exportOverdueLastMonth = async (req, res) => {
    try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);

        const borrows = await Borrow.findAll({
            where: {
                return_date: null,
                due_date: { [Op.between]: [start, end] }
            },
            include: [Book, Borrower]
        });

        const parser = new Parser();
        const csv = parser.parse(borrows.map(mapBorrow));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=overdue_last_month.csv'
        );

        return res.status(200).send(csv);

    } catch (error) {
        return res.status(500).json({ message: 'Failed to export overdue borrows' });
    }
};



/**
 * ===============================
 * Export all borrows (last month)
 * ===============================
 */
exports.exportBorrowsLastMonth = async (req, res) => {
    try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);

        const borrows = await Borrow.findAll({
            where: {
                borrow_date: { [Op.between]: [start, end] }
            },
            include: [Book, Borrower]
        });

        const parser = new Parser();
        const csv = parser.parse(borrows.map(mapBorrow));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=borrows_last_month.csv'
        );

        return res.status(200).send(csv);

    } catch (error) {
        return res.status(500).json({ message: 'Failed to export borrows' });
    }
};
