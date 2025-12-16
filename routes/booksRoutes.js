const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');
const adminAuth = require('../middlewares/adminAuth');
const borrowerAuth=require('../middlewares/borrowerAuth')
const rateLimiter = require('../middlewares/rateLimiter');
const { bookCreateValidation, bookUpdateValidation, bookSearchValidation } = require('../validators/bookValidator');


//router.use('/',authenticate);

router.post('/', rateLimiter('addBook', 5, 60),adminAuth, bookCreateValidation, bookController.addBook);
router.put('/:id', adminAuth ,bookUpdateValidation, bookController.updateBook);
router.delete('/:id',adminAuth ,bookController.deleteBook);
router.get('/', bookController.getAllBooks);
router.get('/search', bookSearchValidation, bookController.searchBooks);

module.exports = router;
