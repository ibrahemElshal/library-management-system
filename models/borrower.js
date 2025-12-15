const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Borrower = sequelize.define('Borrower', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    registered_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'borrowers',
    timestamps: true
});

module.exports = Borrower;
