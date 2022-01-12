const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = require(__dirname + "/../../config/config.js").env;
const config = require(__dirname + "/../../config/database.js")[env];
const db = {};

const excludedFiles = [basename];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf(".") !== 0 &&
            !excludedFiles.includes(file) &&
            file.slice(-3) === ".js"
        );
    })
    .forEach(file => {
        var model = require(path.join(__dirname, file))(sequelize, Sequelize);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
