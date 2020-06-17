"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const dbOperations_1 = require("../dbOperations");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const tableName = process.env.TABLE;
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Email should be unique
        let result = yield dbOperations_1.queryDb(`SELECT email FROM ${tableName} WHERE email='${req.body.email}'`, []);
        console.log(result);
        if (result.rows.length !== 0)
            return res.status(400).send("Email already registered!");
        result = yield dbOperations_1.queryDb(`select * from ${tableName}`, []);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        // Providing Random image for now
        let imageUrl = yield axios_1.default({
            method: "GET",
            url: "https://randomuser.me/api/"
        });
        imageUrl = imageUrl.data.results[0].picture.large;
        yield dbOperations_1.queryDb(`INSERT INTO ${tableName}(id, name, email, password, imageUrl) VALUES($1, $2, $3, $4, $5)`, [result.rowCount + 1, req.body.name, req.body.email, hashPassword, imageUrl]);
        res.json({
            status: "Success",
            email: req.body.email,
            msg: "registeration successful"
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield dbOperations_1.queryDb(`SELECT password FROM ${tableName} WHERE email='${req.body.email}'`, []);
        if (result.rows.length === 0)
            return res.status(400).json({
                status: "Fail",
                msg: "Email or password incorrect!"
            });
        const passwordValid = yield bcrypt_1.default.compare(req.body.password, result.rows[0][0]);
        if (!passwordValid)
            return res.status(400).json({
                status: "Fail",
                msg: "Invalid Password!"
            });
        const token = jsonwebtoken_1.default.sign({ email: req.body.email }, process.env.TOKEN_SECRET || "secret");
        res.header('auth-token', token).send(token);
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
