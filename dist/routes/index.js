"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = require("./notification");
const authenticateUser = require('./helpers/authenticateUser');
const validation_1 = __importDefault(require("./helpers/validation"));
const auth_1 = require("./auth");
const router = require('express').Router();
const blockUser_1 = __importDefault(require("./blockUser"));
const getUsers_1 = __importDefault(require("./getUsers"));
const likeUser_1 = __importDefault(require("./likeUser"));
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
router.get('/', authenticateUser, getUsers_1.default);
router.put('/', authenticateUser, likeUser_1.default);
router.delete('/', authenticateUser, blockUser_1.default);
router.post('/register', validation_1.default, auth_1.register);
router.get('/notifications', authenticateUser, notification_1.getNotification);
router.delete('/notifications', authenticateUser, notification_1.postNotification);
module.exports = router;
