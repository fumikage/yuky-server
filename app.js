const express = require("express");
const expressLogger = require("morgan");
const createError = require("http-errors");

const config = require("./config/config.js");
const utils = require("servertools").server;
const Logger = require("servertools").logger;
const indexRouter = require("./server/routes/index");

let app = express();

app.disable("x-powered-by"); //Sécurité

app.use(expressLogger("dev"));
app.use(
    express.json({
        limit: "100mb"
    })
);
app.use(
    express.urlencoded({
        extended: false,
        limit: "100mb"
    })
);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = config.env === "development" ? err : {};

    utils.sendAPIError(res, err.status || 500, err.message);
});

module.exports = app;

//------------------- Notification de démarrage du serveur ---------------------

require("pkginfo")(module, "version");
const version = module.exports.version;
const dependencies = ["servertools"].reduce((acc, cur) => {
    let v = require(cur).version;
    if (v) {
        acc[cur] = v;
    }
    return acc;
}, {});

//Notification de démarrage du serveur si production
Logger.success(
    `Server <b>mediaserver#${version}</b> started` +
        Object.entries(dependencies).reduce(
            (acc, [k, v]) => `${acc}\n ├> ${k}#${v}`,
            ""
        ),
    config.env === "production"
);
