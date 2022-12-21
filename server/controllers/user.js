const common = require("./common");
const User = require("../models").User;
const Sequelize = require("../models").sequelize;
const validator = require("validator");
const fs = require("fs");
const fsPromises = require("fs").promises;
const config = require("../../config/config.js");

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
    },
    async savePicture(req, res) {
        let id = req.params.id;
        let filePath = config.dataStogage + "/" + id + "/media/profil";
        console.log("test", req.file);
        try {
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }
            await fsPromises.writeFile(
                filePath + "/profil.png",
                req.file.buffer,
                err => {
                    if (err) throw err;

                    console.log("The file was succesfully saved!");
                }
            );
            common.sendAPIResponse(res, 200, "The file was succesfully saved!");
        } catch (error) {
            return common.sendAPIError(res, 404, "ressource_not_found", {
                type: "User"
            });
        }
    },
    async getProfilPicture(req, res) {
        let id = req.params.id;
        let filePath =
            config.dataStogage + "/" + id + "/media/profil/profil.png";
        let data = "";
        if (fs.existsSync(filePath)) {
            data = await fsPromises.readFile(filePath, "base64");
        }
        common.sendAPIResponse(res, 200, {
            buffer: data,
            state: fs.existsSync(filePath)
        });
        console.log(fs.existsSync(filePath));
    }
};
