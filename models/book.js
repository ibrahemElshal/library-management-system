const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isbn: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    shelf_location: {
        type: DataTypes.STRING
    },

    version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0 // Start at version 0
    }
}, {
    version: 'version',
    tableName: 'books',
    timestamps: true,

});

module.exports = Book;
