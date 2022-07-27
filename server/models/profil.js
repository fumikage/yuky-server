"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Profil extends Model {
        static associate(models) {
            Profil.belongsTo(models.User);
        }
    }
    Profil.init(
        {
            picture: DataTypes.BLOB
        },
        {
            sequelize,
            modelName: "Profil"
        }
    );
    return Profil;
};
