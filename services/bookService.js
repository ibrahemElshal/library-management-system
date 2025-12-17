const Book = require('../models/book');
const { Op } = require('sequelize');
const { sanitizeString } = require('../helpers/sanitize');

/**
 * Service to handle book-related operations.
 */
class BookService {
  /**
   * Add a new book.
   * @returns {Promise<Object>} Created book
   */
  static async addBook(data) {
    const { title, author, isbn, quantity, shelf_location } = data;

    const book = await Book.create({
      title: sanitizeString(title),
      author: sanitizeString(author),
      isbn: sanitizeString(isbn),
      quantity: Math.max(0, quantity || 0),
      shelf_location: sanitizeString(shelf_location)
    });

    return book;
  }

  /**
   * Update a book.
   * @returns {Promise<Object>} Updated book
   */
  static async updateBook(id, data) {
    const book = await Book.findByPk(id);
    if (!book) throw new Error('Book not found');

    const { title, author, isbn, quantity, shelf_location } = data;

    await book.update({
      title: title ? sanitizeString(title) : book.title,
      author: author ? sanitizeString(author) : book.author,
      isbn: isbn ? sanitizeString(isbn) : book.isbn,
      quantity: quantity !== undefined ? Math.max(0, quantity) : book.quantity,
      shelf_location: shelf_location ? sanitizeString(shelf_location) : book.shelf_location
    });

    return book;
  }

  /**
   * Delete a book.
   * @returns {Promise<Object>} Result message
   */
  static async deleteBook(id) {
    const book = await Book.findByPk(id);
    if (!book) throw new Error('Book not found');

    await book.destroy();
    return { message: 'Book deleted successfully' };
  }

  /**
   * Get all books.
   * @returns {Promise<Object>} Paginated books
   */
  static async getAllBooks(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Book.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      books: rows
    };
  }

  /**
   * Search books.
   * @returns {Promise<Array>} List of books
   */
  static async searchBooks(query) {
    if (!query) throw new Error('Query is required');

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${sanitizeString(query)}%` } },
          { author: { [Op.like]: `%${sanitizeString(query)}%` } },
          { isbn: { [Op.like]: `%${sanitizeString(query)}%` } }
        ]
      }
    });

    return books;
  }
}

module.exports = BookService;
