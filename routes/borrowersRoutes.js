const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrowersController');
const authenticate = require('../middlewares/authMiddleware');
const { borrowerCreateValidation, borrowerUpdateValidation } = require('../validators/borrowerValidator');

router.use(authenticate);

router.post('/', borrowerCreateValidation, borrowerController.addBorrower);
router.put('/:id', borrowerUpdateValidation, borrowerController.updateBorrower);
router.delete('/:id', borrowerController.deleteBorrower);
router.get('/', borrowerController.getAllBorrowers);

module.exports = router;
