const express = require("express");
const utils = require("servertools").server;

const version = require("../../package.json").version;
const router = express.Router();

router.get("/", function(req, res) {
    utils.sendAPIResponse(res, 200, {
        message: "Yuky Server",
        version
    });
});

module.exports = router;
