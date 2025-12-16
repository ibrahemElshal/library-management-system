const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middlewares/adminAuth');
const borrowerAuth=require('../middlewares/borrowerAuth')

router.post('/add', adminController.addAdmin);

// Login
router.post('/login', adminController.login);

module.exports = router;
