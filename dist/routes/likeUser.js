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
const sockets_1 = require("../sockets");
const dbOperations_1 = require("../dbOperations");
require("dotenv/config");
const tableName = process.env.TABLE;
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // req.body.email - email of user whose image is liked
    try {
        let likedBy = yield dbOperations_1.queryDb(`select likedBy from ${tableName} where email='${req.body.email}'`, []);
        likedBy = likedBy.rows[0][0];
        if (likedBy === null)
            likedBy = [];
        // One user can only like others once
        if (likedBy.indexOf(req.user.email) === -1) {
            yield dbOperations_1.queryDb(`update ${tableName} set likedBy=array_cat(likedBy, ARRAY['${req.user.email}']) where email='${req.body.email}'`, []);
            const notificationMsg = `${req.user.email} liked your profile`;
            yield dbOperations_1.queryDb(`update ${tableName} set notifications=array_cat(notifications, ARRAY['${notificationMsg}']) where email='${req.body.email}'`, []);
            const connections = sockets_1.getConnections();
            const likeUserConnection = connections.filter((con) => con.email === req.body.email);
            // Send notification to liked user if his socket is connected now
            if (likeUserConnection.length !== 0) {
                likeUserConnection[0].socket.emit('notification', { notification: notificationMsg });
            }
            res.json({
                status: "Success",
                email: req.body.email,
                msg: "liked"
            });
        }
        else {
            res.json({
                status: "Fail",
                email: req.body.email,
                msg: 'user already liked'
            });
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
});
