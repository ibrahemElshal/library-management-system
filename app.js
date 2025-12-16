const express = require('express');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/booksRoutes');
const borrowerRoutes = require('./routes/borrowersRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();
app.use(bodyParser.json());

app.use('/api/admin', adminRoutes); 
app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/analytics', analyticsRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;