const BorrowService = require('../services/borrowService');


/**
 * Checkout a book for a borrower.
 */
exports.checkoutBook = async (req, res) => {
  try {


    const borrow = await BorrowService.checkoutBook(req.body);
    res.status(201).json(borrow);

  } catch (err) {
    if (err.name === 'SequelizeOptimisticLockError') {
      return res.status(409).json({
        message: 'Book was modified by another transaction. Please retry.'
      });
    }
    res.status(err.status || 500).json({ message: err.message });
  }
};

/**
 * Return a borrowed book.
 */
exports.returnBook = async (req, res) => {
  try {
    const result = await BorrowService.returnBook(req.params.id);
    res.json({ ...result, message: 'Book returned successfully' });

  } catch (err) {
    if (err.name === 'SequelizeOptimisticLockError') {
      return res.status(409).json({
        message: 'Book was modified by another transaction. Please retry.'
      });
    }
    res.status(err.status || 500).json({ message: err.message });
  }
};

/**
 * Get all borrowed books for a specific borrower.
 */
exports.getBorrowedBooks = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const data = await BorrowService.getBorrowedBooks(
      req.params.borrower_id,
      parseInt(page) || 1,
      parseInt(limit) || 10
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all overdue books.
 */
exports.getOverdueBooks = async (req, res) => {
  try {
    const borrows = await BorrowService.getOverdueBooks();
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
