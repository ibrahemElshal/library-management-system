const Borrow = require('../models/borrow');
const Book = require('../models/book');
const Borrower = require('../models/borrower');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');



const sanitizeCSVValue = (value) => {
    if (typeof value === 'string' && /^[=+\-@]/.test(value)) {
        return `'${value}`;
    }
    return value;
};

const parseDate = (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    return date;
};

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




// exports.exportBorrowDataCSV = async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;

//         if (!startDate || !endDate) {
//             return res.status(400).json({ message: 'startDate and endDate are required' });
//         }

//         const start = parseDate(startDate);
//         const end = parseDate(endDate);

//         if (start > end) {
//             return res.status(400).json({ message: 'startDate must be before endDate' });
//         }

//         const borrows = await Borrow.findAll({
//             where: {
//                 borrow_date: { [Op.between]: [start, end] }
//             },
//             include: [Book, Borrower]
//         });

//         const data = borrows.map(mapBorrow);

//         const parser = new Parser();
//         const csv = parser.parse(data);

//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader(
//             'Content-Disposition',
//             `attachment; filename=borrows_${startDate}_${endDate}.csv`
//         );

//         return res.status(200).send(csv);

//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({ message: error.message });
//     }
// };

exports.exportBorrowDataCSV = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: 'startDate and endDate are required'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({
                message: 'startDate must be before endDate'
            });
        }

        // 2️⃣ Analytics Query
        const analytics = await Borrow.findAll({
            where: {
                borrow_date: {
                    [Op.between]: [start, end]
                },
                return_date: {
                    [Op.ne]: null
                }
            },
            attributes: [
                'book_id',
                [fn('COUNT', col('Borrow.id')), 'total_borrows'],
                [
                    fn(
                        'AVG',
                        literal('DATEDIFF(return_date, borrow_date)')
                    ),
                    'avg_borrow_days'
                ]
            ],
            include: [
                {
                    model: Book,
                    attributes: ['title', 'isbn']
                }
            ],
            group: ['book_id', 'Book.id'],
            order: [[fn('COUNT', col('Borrow.id')), 'DESC']]
        });

        const data = analytics.map(row => ({
            book_title: row.Book.title,
            isbn: row.Book.isbn,
            total_borrows: row.get('total_borrows'),
            average_borrow_days: Number(
                parseFloat(row.get('avg_borrow_days')).toFixed(2)
            )
        }));

        const parser = new Parser({
            fields: [
                'book_title',
                'isbn',
                'total_borrows',
                'average_borrow_days'
            ]
        });

        const csv = parser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=borrow_analytics_${startDate}_${endDate}.csv`
        );

        return res.status(200).send(csv);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Failed to generate borrow analytics report'
        });
    }
};

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
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};




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
        console.log(error);
        return res.status(500).json({ message: 'Failed to export overdue borrows' });
    }
};



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
        console.log(error);
        return res.status(500).json({ message: 'Failed to export borrows' });
    }
};
