const _ = require("lodash");

class APIError extends Error {
    constructor(code, message, details) {
        super(message);
        this.name = "APIError";
        this.code = code;
        this.details = details;
    }

    send(res) {
        sendAPIError(res, this.code, this.message, this.details);
    }
}

function sendAPIResponse(res, code, data, meta = {}) {
    if (res.start) {
        meta.time = Date.now() - res.start;
    }
    res.status(code);
    res.json({ meta, data });
}

function sendAPIError(res, codeOrError, error, details) {
    let code;
    if (codeOrError instanceof APIError) {
        code = codeOrError.code;
        error = codeOrError.error;
        details = codeOrError.details;
    } else {
        code = codeOrError;
    }
    let response = {
        meta: { error, details },
        data: null
    };
    res.status(code);
    res.json(response);
}

module.exports = {
    APIError,
    sendAPIResponse,
    sendAPIError,

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
        console.error(`500 : ${error}`);
        return [500, errCode];
    }
};
