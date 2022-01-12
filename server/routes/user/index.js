const express = require("express");
const UserController = require("../../controllers/user");

const user = express.Router();

user.post("/checkmail", UserController.checkmail);
user.post("/", UserController.create);

async function login(req, res) {
    return await UserController.login(req, res);
}
module.exports = {
    user,
    login
};
