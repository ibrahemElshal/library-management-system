const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const adminAuth = require('../middlewares/adminAuth');
const borrowerAuth = require('../middlewares/borrowerAuth')
const rateLimiter = require('../middlewares/rateLimiter');
const validateRequest = require('../middlewares/validateRequest');
const { bookCreateValidation, bookUpdateValidation, bookSearchValidation } = require('../validators/bookValidator');


//router.use('/',authenticate);

router.post('/', rateLimiter('addBook', 5, 60), adminAuth, bookCreateValidation, validateRequest, bookController.addBook);
router.put('/:id', adminAuth, bookUpdateValidation, validateRequest, bookController.updateBook);
router.delete('/:id', adminAuth, bookController.deleteBook);
router.get('/', bookController.getAllBooks);
router.get('/search', bookSearchValidation, validateRequest, bookController.searchBooks);

module.exports = router;
