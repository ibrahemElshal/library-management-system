const express = require('express');
const router = express.Router();

// Import all route modules
const adminRoutes = require('./adminRoutes');
const bookRoutes = require('./booksRoutes');
const borrowerRoutes = require('./borrowersRoutes');
const borrowRoutes = require('./borrowRoutes');

// Mount routes
router.use('/admin', adminRoutes);
router.use('/books', bookRoutes);
router.use('/borrowers', borrowerRoutes);
router.use('/borrows', borrowRoutes);

module.exports = router;

