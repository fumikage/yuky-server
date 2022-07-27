"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn("Profils", "userId", {
            type: Sequelize.INTEGER,
            references: {
                model: "Users",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
        });
    },

    down: async queryInterface => {
        return queryInterface.removeColumn("Profils", "userId");
    }
};
