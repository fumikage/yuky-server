const express = require("express");
const router = express.Router();

router.use("/", require("./public"));

router.use("/user", require("./user").user);

module.exports = router;
