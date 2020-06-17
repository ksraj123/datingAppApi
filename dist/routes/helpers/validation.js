"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
// Registeration Validation
exports.default = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string()
            .required(),
        email: joi_1.default.string()
            .required()
            .email(),
        password: joi_1.default.string()
            .min(6)
            .required() // set the password to have alphanumeric special characters etc later on
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            status: "Fail",
            msg: error.details[0].message
        });
    }
    else {
        next();
    }
};
