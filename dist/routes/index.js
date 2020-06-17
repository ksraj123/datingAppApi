"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = require("./notification");
const authenticateUser_1 = __importDefault(require("./helpers/authenticateUser"));
const validation_1 = __importDefault(require("./helpers/validation"));
const auth_1 = require("./auth");
const blockUser_1 = __importDefault(require("./blockUser"));
const express = __importStar(require("express"));
const getUsers_1 = __importDefault(require("./getUsers"));
const likeUser_1 = __importDefault(require("./likeUser"));
const router = express.Router();
/*
Routes
POST    /api/user/login
POST    /api/user/regiser
GET     /api/user               - Sends list of users to display for the logged-in user
PUT     /api/user               - updates DB and emits socket event when user liked
DELETE  /api/user               - blocks user and updates DB
GET     /api/user/notifications - Sends list of notifications to frontend
DELETE  /api/user/notifications - After viewing notifications, requested by frontend
*/
router.post('/login', auth_1.login);
router.get('/', authenticateUser_1.default, getUsers_1.default);
router.put('/', authenticateUser_1.default, likeUser_1.default);
router.delete('/', authenticateUser_1.default, blockUser_1.default);
router.post('/register', validation_1.default, auth_1.register);
router.get('/notifications', authenticateUser_1.default, notification_1.getNotification);
router.delete('/notifications', authenticateUser_1.default, notification_1.postNotification);
exports.default = router;
