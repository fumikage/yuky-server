"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_CONFIG = require("../../config/config").jwt;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            mail: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING,
                validate: {
                    notNull: { msg: "mail.null" },
                    isEmail: { msg: "mail.invalid" },
                    len: { args: [0, 255], msg: "mail.length" }
                }
            },
            firstName: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notNull: { msg: "firstName.null" },
                    notEmpty: { msg: "firstName.empty" },
                    len: { args: [0, 100], msg: "firstName.length" }
                }
            },
            lastName: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notNull: { msg: "lastName.null" },
                    notEmpty: { msg: "lastName.empty" },
                    len: { args: [0, 100], msg: "lastName.length" }
                }
            },
            birthday: {
                allowNull: false,
                type: DataTypes.DATE,
                validate: {
                    notNull: { msg: "birthday.null" },
                    notEmpty: { msg: "birthday.empty" },
                    len: { args: [0, 100], msg: "birthday.length" }
                }
            },
            sex: DataTypes.STRING,
            password: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notNull: { msg: "password.null" },
                    len: { args: [8, 255], msg: "password.short" }
                }
            },
            phone: {
                allowNull: true,
                type: DataTypes.STRING,
                validate: {
                    len: { args: [0, 100], msg: "phone.length" }
                }
            }
        },
        {}
    );

    User.beforeCreate(_hashPassword);
    User.beforeUpdate(_hashPassword);

    User.prototype.checkPassword = async function(password) {
        let res = await bcrypt.compare(password, this.password);
        console.log(res);
        return res;
    };
    User.prototype.generateAccessToken = function() {
        return jwt.sign(
            { id: this.id, credentials: this.credentials },
            JWT_CONFIG.access_token.secret,
            {
                expiresIn: JWT_CONFIG.access_token.ttl,
                issuer: JWT_CONFIG.access_token.issuer
            }
        );
    };

    User.prototype.generateRefreshToken = function() {
        return jwt.sign({ id: this.id }, JWT_CONFIG.refresh_token.secret, {
            expiresIn: JWT_CONFIG.refresh_token.ttl,
            issuer: JWT_CONFIG.refresh_token.issuer
        });
    };

    return User;
};

async function _hashPassword(user) {
    if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
}
