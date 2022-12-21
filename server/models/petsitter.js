"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Petsitter extends Model {
        static associate(models) {
            Petsitter.belongsTo(models.User);
        }
    }
    Petsitter.init(
        {
            pet_accepted: DataTypes.STRING,
            other: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "Petsitter"
        }
    );
    return Petsitter;
};
