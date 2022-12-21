"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Pets extends Model {
        static associate(models) {
            Pets.belongsTo(models.User);
        }
    }
    Pets.init(
        {
            name: DataTypes.STRING,
            species: DataTypes.STRING,
            breed: DataTypes.STRING,
            age: DataTypes.STRING,
            sex: DataTypes.INTEGER,
            description: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "Pets"
        }
    );
    return Pets;
};
