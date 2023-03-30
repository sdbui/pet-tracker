module.exports = (sequelize, DataTypes) => {
    const Treat = sequelize.define('Treat', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
        },
        description: {
            type: DataTypes.TEXT,
        },
        calories: {
            type: DataTypes.INTEGER
        },
    });
    return Treat;
}
