const _ = require("lodash");
const logger = require("servertools").logger;
const server = require("servertools").server;

const { Op } = require("sequelize");

class APIError extends Error {
    constructor(code, message, details) {
        super(message);
        this.name = "APIError";
        this.code = code;
        this.details = details;
    }

    send(res) {
        server.sendAPIError(res, this.code, this.message, this.details);
    }
}

module.exports = {
    APIError,

    onCRUDError(error, errCode = "internal_error") {
        if (error.name === "AggregateError") {
            if (error[0] && error[0].name === "SequelizeBulkRecordError") {
                error = error[0].errors;
            }
        }
        if (error.name === "SequelizeValidationError") {
            return [
                400,
                "validation_failed",
                error.errors.reduce((acc, cur) => {
                    let [field, value] = cur.message.split(".");
                    acc[field] = [...(acc[field] || []), value];
                    return acc;
                }, {})
            ];
        }
        //On passe ici si erreur non reconnue
        logger.error(`500 : ${error}`);
        return [500, errCode];
    },

    // Create options for Filter-Sort-Paginate
    createOptionsFSP(req, model, opt = {}) {
        let { filter, sortby, limit, offset } = req.query;
        let options = { ...opt };

        //Gestion des options de filtrage
        if (filter) {
            try {
                options.where = _parseFilter(filter, model);
            } catch (error) {
                if (error.name === "FilterError") {
                    throw new APIError(400, "invalid_param", {
                        param: "filter",
                        details: error.message
                    });
                } else {
                    throw new APIError(500, "select_failed", {
                        on: "prefilter"
                    });
                }
            }
        }

        //Gestion des options de tri
        let order = (sortby || "").split(",").reduce((acc, cur) => {
            if (cur) {
                if (cur.charAt(0) === "-") {
                    acc.push([cur.substring(1), "DESC"]);
                } else {
                    acc.push([cur]);
                }
            }
            return acc;
        }, []);
        if (order.length) {
            options.order = order;
        }

        //Gestion des options de pagination
        if (limit) {
            limit = +limit;
            if (limit) {
                options.limit = limit;
            } else {
                throw new APIError(400, "invalid_param", {
                    param: "limit"
                });
            }
        }
        if (offset) {
            offset = +offset;
            if (offset) {
                options.offset = offset;
            } else {
                throw new APIError(400, "invalid_param", {
                    param: "offset"
                });
            }
        }

        return options;
    }
};

// ---------------------------------------------------------------------- FILTER

function _parseFilter(filter, model) {
    let groups = _.compact(_.map(_.split(filter, " or "), _.trim));
    groups = _.map(groups, group => {
        let requests = _.compact(_.map(_.split(group, " and "), _.trim));
        return _.map(requests, r => _parseFilterRequest(r, model)).reduce(
            (acc, cur) => {
                return { ...acc, ...cur };
            },
            {}
        );
    });
    return { [Op.or]: groups };
}

function _parseFilterRequest(request, model) {
    let [field, operator, ...value] = _.split(request, " ");
    if (model.FILTER_WHITELIST && !model.FILTER_WHITELIST.includes(field)) {
        throw new FilterError(`field.forbidden:${field}`);
    }
    if (!OPERATOR_WHITELIST[operator]) {
        throw new FilterError(`operator.forbidden:${operator}`);
    }
    value = value.join(" ");
    switch (value) {
        case "null":
            value = null;
            break;
        case "true":
            value = true;
            break;
        case "false":
            value = false;
            break;
        default:
            break;
    }
    return { [field]: { [OPERATOR_WHITELIST[operator]]: value } };
}

const OPERATOR_WHITELIST = [
    "eq",
    "ne",
    "is",
    "not",
    "gt",
    "gte",
    "lt",
    "lte",
    "startsWith",
    "endsWith",
    "substring",
    "regexp",
    "notRegexp"
].reduce((acc, cur) => {
    acc[cur] = Op[cur];
    return acc;
}, {});

class FilterError extends Error {
    constructor(message) {
        super(message);
        this.name = "FilterError";
    }
}

// -----------------------------------------------------------------------------
