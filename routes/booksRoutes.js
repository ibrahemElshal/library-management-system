const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');
const authenticate = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');
const { bookCreateValidation, bookUpdateValidation, bookSearchValidation } = require('../validators/bookValidator');


router.use('/',authenticate);

router.post('/', rateLimiter('addBook', 5, 60), bookCreateValidation, bookController.addBook);
router.put('/:id', bookUpdateValidation, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.get('/', bookController.getAllBooks);
router.get('/search', bookSearchValidation, bookController.searchBooks);

module.exports = router;
