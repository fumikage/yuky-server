const common = require("./common");
const User = require("../models").User;
const Sequelize = require("../models").sequelize;
const validator = require("validator");
const { utils } = require("mocha");
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
                return common.sendAPIResponse(res, 200, 0);
            } else {
                return common.sendAPIResponse(res, 200, 1);
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
                return common.sendAPIError(res, 400, "validation_failed", {
                    mail: ["exists"]
                });
            }
        } else {
            return common.sendAPIError(res, 400, "validation_failed", {
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
            common.sendAPIResponse(res, 201, { id: user.id });
        } catch (error) {
            return common.sendAPIError(
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
                    lastName: user.lastName,
                    picture: ""
                };
                await user.update({
                    connectedAt: Sequelize.literal("CURRENT_TIMESTAMP")
                });
                return common.sendAPIResponse(res, 200, {
                    access_token,
                    refresh_token,
                    user: userData
                });
            } else {
                return common.sendAPIError(res, 403, "login_failed");
            }
        } else {
            return common.sendAPIError(res, 400, "validation_failed", {
                mail: mail ? [] : ["empty"],
                password: password ? [] : ["empty"]
            });
        }
    },
    async get(req, res) {
        let id = req.params.id;
        let user = await User.findOne({ where: { id } });
        if (user) {
            common.sendAPIResponse(res, 200, user);
        } else {
            common.sendAPIError(res, 404, "ressource_not_found", {
                type: "User"
            });
        }
    }
};
