const Book = require('../models/book');
const { Op } = require('sequelize');
const { sanitizeString } = require('../helpers/sanitize');
const { validationResult } = require('express-validator');

exports.addBook = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, author, isbn, quantity, shelf_location } = req.body;

        const book = await Book.create({
            title: sanitizeString(title),
            author: sanitizeString(author),
            isbn: sanitizeString(isbn),
            quantity: Math.max(0, quantity || 0),
            shelf_location: sanitizeString(shelf_location)
        });

        res.status(201).json(book);

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { title, author, isbn, quantity, shelf_location } = req.body;

        await book.update({
            title: title ? sanitizeString(title) : book.title,
            author: author ? sanitizeString(author) : book.author,
            isbn: isbn ? sanitizeString(isbn) : book.isbn,
            quantity: quantity !== undefined ? Math.max(0, quantity) : book.quantity,
            shelf_location: shelf_location ? sanitizeString(shelf_location) : book.shelf_location
        });

        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        await book.destroy();
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        const books = await Book.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${sanitizeString(query)}%` } },
                    { author: { [Op.like]: `%${sanitizeString(query)}%` } },
                    { isbn: { [Op.like]: `%${sanitizeString(query)}%` } }
                ]
            }
        });
        

        res.json(books);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
