const dotenv = require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database.js');

const PORT = process.env.PORT || 5001;
console.log('hello')
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
