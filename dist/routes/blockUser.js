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
//remove likes by each other on each other's profile when blocked
// give an obtion to unblock also
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // req.body.email - email of user to be blocked
    try {
        console.log(req.user.email);
        yield dbOperations_1.queryDb(`update ${tableName} set blockedBy=array_cat(blockedBy, ARRAY['${req.user.email}']) where email='${req.body.email}'`, []);
        res.json({
            status: "Success",
            email: req.body.email,
            msg: "blocked"
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
