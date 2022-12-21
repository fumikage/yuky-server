const express = require("express");
const PetController = require("../controllers/pet");
const multer = require("multer");

const pet = express.Router();
const pets = express.Router();

const upload = multer({ image: { type: Buffer } });

pet.post("/", PetController.create);
pets.get("/:id/user", PetController.getUserPets);
pets.get("/:id/user/media", PetController.getUserPetsMedia);
pet.post(
    "/:petId/user/:userId",
    upload.single("file"),
    PetController.createPetsMedia
);

module.exports = { pet, pets };
