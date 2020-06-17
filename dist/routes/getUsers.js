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
const dbOperations_1 = require("../dbOperations");
require("dotenv/config");
const tableName = process.env.TABLE;
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield dbOperations_1.queryDb(`select email, name, imageUrl from ${tableName}`, []);
        result = result.rows;
        // list of people who have blocked the user
        let blockedBy = yield dbOperations_1.queryDb(`select blockedBy from ${tableName} where email='${req.user.email}'`, []);
        blockedBy = blockedBy.rows[0][0];
        if (blockedBy === null)
            blockedBy = [];
        result = result.filter((ele) => blockedBy.indexOf(ele[0]) === -1 && ele[0] !== req.user.email);
        let notifications = yield dbOperations_1.queryDb(`select notifications from ${tableName} where email='${req.user.email}'`, []);
        // console.log(notifications.rows[0][0]);
        notifications = notifications.rows[0][0];
        res.json({
            status: "Success",
            email: req.user.email,
            result,
            notificationCount: (notifications) ? notifications.length : 0
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
