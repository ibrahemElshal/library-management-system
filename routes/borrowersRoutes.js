const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const borrowerAuth=require('../middlewares/borrowerAuth')
const { borrowerCreateValidation, borrowerUpdateValidation } = require('../validators/borrowerValidator');
const borrowerController = require('../controllers/borrowersController');

router.post('/register', borrowerController.register);

router.post('/login', borrowerController.login);


// router.post('/', borrowerCreateValidation, borrowerController.addBorrower);
router.put('/:id', borrowerUpdateValidation, borrowerController.updateBorrower);
router.delete('/:id',adminAuth ,borrowerController.deleteBorrower);
router.get('/', adminAuth,borrowerController.getAllBorrowers);

module.exports = router;
