const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const { initRedis } = require('./config/redis');
const routes = require('./routes');


const app = express();
app.use(bodyParser.json());
initRedis();

// Mount all routes under /api prefix
app.use('/api', routes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;