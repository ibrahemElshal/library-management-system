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
    const transaction = await sequelize.transaction();
  
    try {
      const borrow = await Borrow.findByPk(req.params.id, { 
        transaction,
       
        attributes: [
            'id', 'borrow_date', 'due_date', 'return_date', 
            'book_id', 'borrower_id', 'createdAt', 'updatedAt', 
            'version'
        ]
      });
  
      if (!borrow) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Borrow record not found' });
      }
  
      if (borrow.return_date) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Book already returned' });
      }
      
      const originalVersion = borrow.version;
      
      const newReturnDate = new Date();
      const newVersion = originalVersion + 1; 

      const [affectedRows] = await Borrow.update(
        { 
          return_date: newReturnDate, 
          version: newVersion, 
        },
        { 
          where: { 
            id: borrow.id, 
            version: originalVersion
          }, 
          transaction 
        }
      );

      if (affectedRows === 0) {
        await transaction.rollback();
        return res.status(409).json({ 
          message: 'The borrow record was modified by another user. Please reload and try again.' 
        });
      }

      const book = await Book.findByPk(borrow.book_id, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });
  
      await book.increment('quantity', { by: 1, transaction });
  
      await transaction.commit();
  
      res.json({ 
          id: borrow.id, 
          return_date: newReturnDate, 
          message: 'Book returned successfully' 
      });
  
    } catch (err) {
      await transaction.rollback();
      console.error(err);
      res.status(500).json({ message: 'Return failed' });
    }
  };
// pessimistic lock 
// exports.returnBook = async (req, res) => {
//     const transaction = await sequelize.transaction();
  
//     try {
//       const borrow = await Borrow.findByPk(req.params.id, { transaction });
  
//       if (!borrow) {
//         await transaction.rollback();
//         return res.status(404).json({ message: 'Borrow record not found' });
//       }
  
//       if (borrow.return_date) {
//         await transaction.rollback();
//         return res.status(400).json({ message: 'Book already returned' });
//       }
  
//       borrow.return_date = new Date();
//       await borrow.save({ transaction });
      
//       const book = await Book.findByPk(borrow.book_id, {
//         transaction,
//         lock: transaction.LOCK.UPDATE
//       });
  
//       await book.increment('quantity', { by: 1, transaction });
  
//       await transaction.commit();
  
//       res.json(borrow);
  
//     } catch (err) {
//       await transaction.rollback();
//       console.error(err);
//       res.status(500).json({ message: 'Return failed' });
//     }
//   };
  



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
      let { page, limit } = req.query;
  
      page = page ? parseInt(page) : 1;
      limit = limit ? parseInt(limit) : 10;
      const offset = (page - 1) * limit;
  
      const { count, rows } = await Borrow.findAndCountAll({
        where: {
          borrower_id: borrowerId,
          return_date: null
        },
        include: [
          {
            model: Book,
            attributes: ['id', 'title', 'author', 'isbn', 'shelf_location']
          }
        ],
        limit,
        offset,
        order: [['borrow_date', 'DESC']]
      });
  
      res.status(200).json({
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        borrows: rows
      });
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
