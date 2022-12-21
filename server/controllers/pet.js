const common = require("./common");
const Pets = require("../models").Pets;
const User = require("../models").User;
const config = require("../../config/config.js");
const fsPromises = require("fs").promises;
const fs = require("fs");
const { v4 } = require("uuid");

module.exports = {
    allOptions: {
        attributes: { exclude: ["path"] }
    },
    oneOptions: {},

    async create(req, res) {
        let { pet, userId } = req.body;
        try {
            let user = await User.findOne({ where: { id: userId } });

            if (user) {
                let petCreate = await user.createPet(pet);
                common.sendAPIResponse(res, 201, { id: petCreate.id });
            }
        } catch (error) {
            return common.sendAPIError(
                res,
                ...common.onCRUDError(error, "create_failed")
            );
        }
    },
    async createPetsMedia(req, res) {
        let { petId, userId } = req.params;
        try {
            let pet = await Pets.findOne({ where: { id: petId } });

            if (pet) {
                let filePath =
                    config.dataStogage + "/" + userId + "/media/pets/";
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                }
                await fsPromises.writeFile(
                    filePath + "/" + petId + ".png",
                    req.file.buffer,
                    err => {
                        if (err) throw err;

                        console.log("The file was succesfully saved!");
                    }
                );
                common.sendAPIResponse(
                    res,
                    200,
                    "The file was succesfully saved!"
                );
            }
        } catch (error) {
            return common.sendAPIError(res, 404, "ressource_not_found", {
                type: "Pet"
            });
        }
    },
    async getUserPetsMedia(req, res) {
        let id = req.params.id;
        try {
            let user = await User.findOne({ where: { id: id } });

            if (user) {
                let pets = await Pets.findAll({ where: { userId: id } });
                let medias = [];
                for (let pet of pets) {
                    pet.media = "";
                    let filePath =
                        config.dataStogage +
                        "/" +
                        id +
                        "/media/pets/" +
                        pet.id +
                        ".png";

                    if (fs.existsSync(filePath)) {
                        medias.push(
                            await fsPromises.readFile(filePath, "base64")
                        );
                    } else {
                        medias.push("/image/pets.svg");
                    }
                }
                common.sendAPIResponse(res, 200, medias);
            }
        } catch (error) {
            common.sendAPIError(res, 404, "ressource_not_found", {
                type: "Pets"
            });
        }
    },
    async getUserPets(req, res) {
        let id = req.params.id;
        try {
            let user = await User.findOne({ where: { id: id } });

            if (user) {
                let pets = await Pets.findAll({ where: { userId: id } });

                common.sendAPIResponse(res, 200, pets);
            }
        } catch (error) {
            common.sendAPIError(res, 404, "ressource_not_found", {
                type: "Pets"
            });
        }
    }
};
