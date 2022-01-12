const utils = require("servertools").server;
const common = require("./common");
const User = require("../models").User;
const Sequelize = require("../models").sequelize;
const validator = require("validator");
// const config = require("../../config/config");
module.exports = {
    allOptions: {
        attributes: { exclude: ["path"] }
    },
    oneOptions: {},

    async checkmail(req, res) {
        console.log("test");
        let { mail } = req.body;
        console.log({ mail });
        if (mail) {
            console.log("12");
            if (await User.findOne({ where: { mail } })) {
                return utils.sendAPIResponse(res, 200, 0);
            } else {
                return utils.sendAPIResponse(res, 200, 1);
            }
        }
    },

    async create(req, res) {
        let {
            mail,
            password,
            firstName,
            lastName,
            phone,
            birthday,
            sex
        } = req.body;

        if (mail) {
            if (await User.findOne({ where: { mail } })) {
                return utils.sendAPIError(res, 400, "validation_failed", {
                    mail: ["exists"]
                });
            }
        } else {
            return utils.sendAPIError(res, 400, "validation_failed", {
                mail: ["null"]
            });
        }

        try {
            let user = await User.create({
                mail,
                password,
                firstName,
                lastName,
                phone,
                birthday,
                sex
            });
            utils.sendAPIResponse(res, 201, { id: user.id });
        } catch (error) {
            return utils.sendAPIError(
                res,
                ...common.onCRUDError(error, "create_failed")
            );
        }
    },

    async login(req, res) {
        let { mail, password } = req.body;
        if (mail && password) {
            mail = validator.normalizeEmail(mail);
            let user = await User.findOne({ where: { mail } });
            if (user && (await user.checkPassword(password))) {
                const access_token = user.generateAccessToken();
                const refresh_token = user.generateRefreshToken();
                const userData = {
                    id: user.id,
                    mail,
                    firstName: user.firstName,
                    lastName: user.lastName
                };
                await user.update({
                    connectedAt: Sequelize.literal("CURRENT_TIMESTAMP")
                });
                return utils.sendAPIResponse(res, 200, {
                    access_token,
                    refresh_token,
                    user: userData
                });
            } else {
                return utils.sendAPIError(res, 403, "login_failed");
            }
        } else {
            return utils.sendAPIError(res, 400, "validation_failed", {
                mail: mail ? [] : ["empty"],
                password: password ? [] : ["empty"]
            });
        }
    }
};
