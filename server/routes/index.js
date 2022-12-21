const express = require("express");
const router = express.Router();

router.use("/", require("./public"));

router.use("/user", require("./user").user);

router.use("/habitation", require("./habitation").habitation);

router.use("/pet", require("./pet").pet);
router.use("/pets", require("./pet").pets);

router.use("/petsitter", require("./petsitter").petsitter);

module.exports = router;
