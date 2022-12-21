const common = require("./common");
const Habitation = require("../models").Habitation;
const config = require("../../config/config.js");
const fsPromises = require("fs").promises;
const { v4 } = require("uuid");

module.exports = {
    allOptions: {
        attributes: { exclude: ["path"] }
    },
    oneOptions: {},

    async get(req, res) {
        let userId = req.params.id;
        console.log("test", userId);
        let habitation = await Habitation.findOne({ where: { userId } });
        if (habitation) {
            common.sendAPIResponse(res, 200, habitation);
        } else {
            common.sendAPIError(res, 404, "ressource_not_found", {
                type: "Habitation"
            });
        }
    },
    async update(req, res) {
        let id = req.params.id;
        let { address, surface, type, deleteFiles, userId } = req.body;
        console.log("test", JSON.stringify(deleteFiles));

        let toUpdate = await Habitation.findOne({
            where: { id: id }
        });
        if (toUpdate) {
            try {
                await toUpdate.update({ address, surface, type });

                let filePath =
                    config.dataStogage + "/" + userId + "/media/habitation/";
                console.log(filePath);
                for (let element of req.files) {
                    await fsPromises.writeFile(
                        filePath + v4() + ".png",
                        element.buffer,
                        err => {
                            if (err) throw err;

                            console.log("The file was succesfully saved!");
                        }
                    );
                }
                console.log(deleteFiles);
                for (let element of deleteFiles) {
                    console.log("el", element);
                }
                common.sendAPIResponse(res, 201);
            } catch (error) {
                return common.sendAPIError(res, 404, "ressource_not_found", {
                    type: "Habitation"
                });
            }
        }
    },
    async getMedia(req, res) {
        let id = req.params.id;
        let filePath = config.dataStogage + "/" + id + "/media/habitation/";
        let files = await fsPromises.readdir(filePath);
        let arrayBuffer = [];
        let arrayFilename = [];
        try {
            for (let element of files) {
                arrayFilename.push(element);
                const data = await fsPromises.readFile(
                    filePath + element,
                    "base64"
                );

                arrayBuffer.push(data);
            }
            common.sendAPIResponse(res, 200, {
                arrayBuffer: arrayBuffer,
                arrayFilename: arrayFilename
            });
        } catch (error) {
            return common.sendAPIError(res, 404, "ressource_not_found", {
                type: "Habitation"
            });
        }
    }
};
