require("dotenv").config();

module.exports = {
    env: process.env.APP_ENV,
    timezone: process.env.APP_TIMEZONE,
    cacheTime: process.env.CACHE_TIME,
    serverRoot: process.env.SERVER_ROOT
};
