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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNotification = exports.getNotification = void 0;
const dbOperations_1 = require("../dbOperations");
require("dotenv/config");
const tableName = process.env.TABLE;
exports.getNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield dbOperations_1.queryDb(`select notifications from ${tableName} where email='${req.user.email}'`, []);
        res.json({
            status: "Success",
            email: req.user.email,
            notifications: (result.rows[0][0]) ? result.rows[0][0] : 0
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.postNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield dbOperations_1.queryDb(`update ${tableName} set notifications=NULL where email='${req.user.email}'`, []);
        res.json({
            status: "Success",
            email: req.user.email,
            msg: "notifications deleted"
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
