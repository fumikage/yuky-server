const express = require("express");
const expressLogger = require("morgan");
const common = require("./server/controllers/common");
const createError = require("http-errors");
const cors = require("cors");
const config = require("./config/config.js");
const chalk = require("chalk");
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

app.use(cors());
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = config.env === "development" ? err : {};

    common.sendAPIError(res, err.status || 500, err.message);
});

module.exports = app;

console.log(chalk.green("Server runnng"));
