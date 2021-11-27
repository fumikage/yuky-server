require("dotenv").config();

module.exports = {
    development: {
        database: process.env.DB_DEV_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        seederStorage: "sequelize",
        define: {
            charset: "utf8mb4",
            dialectOptions: { collate: "utf8mb4_unicode_ci" },
            timestamps: true
        },
        logging: false
    },
    test: {
        database: process.env.DB_TEST_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        seederStorage: "sequelize",
        define: {
            charset: "utf8mb4",
            dialectOptions: { collate: "utf8mb4_unicode_ci" },
            timestamps: true
        },
        logging: false
    },
    production: {
        database: process.env.DB_PROD_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOSTNAME,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        seederStorage: "sequelize",
        define: {
            charset: "utf8mb4",
            dialectOptions: { collate: "utf8mb4_unicode_ci" },
            timestamps: true
        },
        logging: false
    }
};
