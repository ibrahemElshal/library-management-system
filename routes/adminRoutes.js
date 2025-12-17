const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.post('/add', adminController.addAdmin);

// Login
router.post('/login', adminController.login);

module.exports = router;
