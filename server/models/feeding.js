module.exports = (sequelize, DataTypes) => {
    const Feeding = sequelize.define('Feeding', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        amount: {
            type: DataTypes.INTEGER,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return Feeding;
}


/**
 * 
 * 
 * Pet HasMany Feedings
 * Feeding BelongsTo Pet
 * Feeding BelongsTo Treat
 * Treat HasMany Feedings
 * 
 * 
 */