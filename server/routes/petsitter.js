const express = require("express");
const PetsitterController = require("../controllers/petsitter");

const petsitter = express.Router();

petsitter.put("/:userId/user", PetsitterController.update);
petsitter.get("/:userId/user", PetsitterController.get);

module.exports = { petsitter };
