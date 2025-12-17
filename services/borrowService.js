const Borrow = require('../models/borrow');
const Book = require('../models/book');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

/**
 * Service to handle borrowing operations.
 */
class BorrowService {

  /**
   * Checkout a book.
   */
  static async checkoutBook({ borrower_id, book_id, due_date }) {
    const transaction = await sequelize.transaction();

    try {
      const book = await Book.findByPk(book_id, { transaction });
      if (!book) throw { status: 404, message: 'Book not found' };
      if (book.quantity < 1) throw { status: 400, message: 'Book not available' };

      const borrow = await Borrow.create({
        borrower_id,
        book_id,
        due_date: new Date(due_date)
      }, { transaction });

      book.quantity -= 1;
      await book.save({ transaction });

      await transaction.commit();
      return borrow;

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Return a book.
   */
  static async returnBook(borrowId) {
    const transaction = await sequelize.transaction();

    try {
      const borrow = await Borrow.findByPk(borrowId, { transaction });
      if (!borrow) throw { status: 404, message: 'Borrow record not found' };
      if (borrow.return_date) throw { status: 400, message: 'Book already returned' };

      const book = await Book.findByPk(borrow.book_id, { transaction });
      if (!book) throw { status: 404, message: 'Book not found' };

      borrow.return_date = new Date();
      await borrow.save({ transaction });

      book.quantity += 1;
      await book.save({ transaction });

      await transaction.commit();
      return {
        id: borrow.id,
        return_date: borrow.return_date
      };

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Get borrowed books for a borrower.
   */
  static async getBorrowedBooks(borrowerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Borrow.findAndCountAll({
      where: { borrower_id: borrowerId, return_date: null },
      include: [{
        model: Book,
        attributes: ['id', 'title', 'author', 'isbn', 'shelf_location']
      }],
      limit,
      offset,
      order: [['borrow_date', 'DESC']]
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      borrows: rows
    };
  }

  /**
   * Get all overdue books.
   */
  static async getOverdueBooks() {
    return Borrow.findAll({
      where: {
        return_date: null,
        due_date: { [Op.lt]: new Date() }
      },
      include: Book
    });
  }
}

module.exports = BorrowService;
