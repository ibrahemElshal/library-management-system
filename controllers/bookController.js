const BookService = require('../services/bookService');


/**
 * Add a new book to the library.
 */
exports.addBook = async (req, res) => {
  try {


    const book = await BookService.addBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Update an existing book.
 */
exports.updateBook = async (req, res) => {
  try {


    const book = await BookService.updateBook(req.params.id, req.body);
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Delete a book.
 */
exports.deleteBook = async (req, res) => {
  try {
    const result = await BookService.deleteBook(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get all books with pagination.
 */
exports.getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await BookService.getAllBooks(page, limit);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Search for books by query string.
 */
exports.searchBooks = async (req, res) => {
  try {
    const books = await BookService.searchBooks(req.query.query);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
