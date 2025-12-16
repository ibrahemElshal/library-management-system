const Borrow = require('../models/borrow');
const Book = require('../models/book');
const { sanitizeString } = require('../helpers/sanitize');
const { validationResult } = require('express-validator');

exports.checkoutBook = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { book_id, borrower_id, due_date } = req.body;

        const book = await Book.findByPk(book_id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.quantity < 1) return res.status(400).json({ message: 'Book not available' });

        const borrow = await Borrow.create({
            book_id,
            borrower_id,
            due_date: new Date(due_date)
        });

        await book.decrement('quantity', { by: 1 });

        res.status(201).json(borrow);

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const borrow = await Borrow.findByPk(req.params.id);
        if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

        borrow.return_date = new Date();
        await borrow.save();

        const book = await Book.findByPk(borrow.book_id);
        await book.increment('quantity', { by: 1 });

        res.json(borrow);

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

// exports.getBorrowedBooks = async (req, res) => {
//     try {
//         const borrower_id = req.params.borrower_id;
//         const borrows = await Borrow.findAll({
//             where: { borrower_id, return_date: null },
//             include: Book
//         });
//         res.json(borrows);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: err.message });
//     }
// };

exports.getBorrowedBooks = async (req, res) => {
  try {
    const borrowerId = req.params.borrower_id;

    const borrows = await Borrow.findAll({
      where: {
        borrower_id: borrowerId,
        return_date: null // only books not returned yet
      },
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'author', 'isbn', 'shelf_location']
        }
      ]
    });

    res.status(200).json(borrows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getOverdueBooks = async (req, res) => {
    try {
        const today = new Date();
        const borrows = await Borrow.findAll({
            where: { return_date: null, due_date: { [require('sequelize').Op.lt]: today } },
            include: Book
        });
        res.json(borrows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
