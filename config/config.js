require("dotenv").config();

module.exports = {
    env: process.env.APP_ENV,
    timezone: process.env.APP_TIMEZONE,
    cacheTime: process.env.CACHE_TIME,
    serverRoot: process.env.SERVER_ROOT,
    jwt: {
        access_token: {
            secret: process.env.JWT_ACCESS_SECRET,
            ttl: process.env.JWT_ACCESS_TTL,
            issuer: process.env.JWT_ISSUER
        },
        refresh_token: {
            secret: process.env.JWT_REFRESH_SECRET,
            ttl: process.env.JWT_REFRESH_TTL,
            issuer: process.env.JWT_ISSUER
        },
        passwordreset_token: {
            secret: process.env.JWT_ACCESS_SECRET,
            ttl: process.env.JWT_PASSWORDRESET_TTL,
            issuer: process.env.JWT_ISSUER
        }
    }
};
