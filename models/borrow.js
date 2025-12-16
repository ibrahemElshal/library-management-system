const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Book = require('./book.js');
const Borrower = require('./borrower.js');

const Borrow = sequelize.define('Borrow', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    borrow_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Book,
            key: 'id'
        },
        allowNull: false
    },
    borrower_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Borrower,
            key: 'id'
        },
        allowNull: false
    }
}, {
    tableName: 'borrows',
    timestamps: true
});

// Associations
Book.hasMany(Borrow, { foreignKey: 'book_id' });
Borrower.hasMany(Borrow, { foreignKey: 'borrower_id' });
Borrow.belongsTo(Book, { foreignKey: 'book_id' });
Borrow.belongsTo(Borrower, { foreignKey: 'borrower_id' });

module.exports = Borrow;
