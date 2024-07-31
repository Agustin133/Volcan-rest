const Joi = require('joi');

const isValidData = (schema, data, isPassword) => {
    if (isPassword) {
        try {
            if (data.password === data.password.toLowerCase()) {
                throw { message: "The password must contain at least one uppercase letter" }
            }
            if (data.password === data.password.toUpperCase()) {
                throw { message: "The password must contain at least one lowercase letter" }
            }
            if (data.password.search(/[0-9]/) < 0) {
                throw { message: "The password must contain at least number" }
            }
        } catch (err) {
            const error = new Error();
            error.code = "bad_request";
            error.severity = "HIGH";
            error.message = err.message;
            throw error;
        }
    }
    Joi.assert(data, schema.error((errors) => {
        const error = new Error();
        error.code = "bad_request";
        error.severity = "HIGH";
        error.message = "The client sent a request that the server could not understand" + errors;
        console.log(error);
        throw error;
    }))
}

module.exports = isValidData;