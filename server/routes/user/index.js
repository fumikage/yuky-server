const express = require("express");
const UserController = require("../../controllers/user");
const multer = require("multer");

const user = express.Router();

const upload = multer({ image: { type: Buffer } });

user.post("/checkmail", UserController.checkmail);
user.post("/", UserController.create);
user.post(
    "/:id/profilpicture",
    upload.single("file"),
    UserController.savePicture
);
user.get("/:id/profilpicture", UserController.getProfilPicture);
async function login(req, res) {
    return await UserController.login(req, res);
}

module.exports = {
    user,
    login
};
