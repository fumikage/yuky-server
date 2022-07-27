const express = require("express");
const common = require("../../server/controllers/common");
const version = require("../../package.json").version;
const router = express.Router();

router.get("/", function(req, res) {
    common.sendAPIResponse(res, 200, {
        message: "Yuky Server",
        version
    });
});

router.post("/login", require("./user").login);

module.exports = router;
