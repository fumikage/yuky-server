const express = require("express");
const HabitationController = require("../controllers/habitation");
const multer = require("multer");

const habitation = express.Router();
const habitations = express.Router();

const upload = multer({ image: { type: Buffer } });

habitation.get("/:id/user", HabitationController.get);
habitation.post(
    "/:id/user",
    upload.array("files"),
    HabitationController.update
);
habitation.get("/:id/media", HabitationController.getMedia);

module.exports = { habitation, habitations };
