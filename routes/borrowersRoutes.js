const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const borrowerAuth = require('../middlewares/borrowerAuth')
const { borrowerCreateValidation, borrowerUpdateValidation } = require('../validators/borrowerValidator');
const validateRequest = require('../middlewares/validateRequest');
const borrowerController = require('../controllers/borrowersController');

router.post('/register', borrowerCreateValidation, validateRequest, borrowerController.register);

router.post('/login', borrowerController.login);


router.put('/:id', borrowerUpdateValidation, validateRequest, borrowerController.updateBorrower);
router.delete('/:id', adminAuth, borrowerController.deleteBorrower);
router.get('/', adminAuth, borrowerController.getAllBorrowers);

module.exports = router;
