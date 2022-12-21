"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Habitation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */

        static associate(models) {
            Habitation.belongsTo(models.User);
        }
    }
    Habitation.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            address: DataTypes.STRING,
            type: DataTypes.STRING,
            surface: DataTypes.FLOAT,
            picture: DataTypes.BLOB
        },
        {
            sequelize,
            modelName: "Habitation"
        }
    );
    return Habitation;
};
