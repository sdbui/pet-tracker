const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Pet = sequelize.define('Pet', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
        },
        weight: {
            type: DataTypes.INTEGER
        },
        pic: {
            type: DataTypes.STRING
        },
    });

    return Pet
}