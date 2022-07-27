"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Users", "picture", {
            allowNull: true,
            type: Sequelize.BLOB
        });
    },

    down: async queryInterface => {
        await queryInterface.removeColumn("Users", "picture");
    }
};
