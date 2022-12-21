"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn("Petsitters", "userId", {
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
        return queryInterface.removeColumn("Petsitters", "userId");
    }
};
