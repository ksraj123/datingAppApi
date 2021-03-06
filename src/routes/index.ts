import {getNotification, postNotification} from './notification';
import authenticateUser from './helpers/authenticateUser';
import regFromValidation from './helpers/validation';
import {login, register} from './auth';
import blockUser from './blockUser';
import * as express from 'express';
import getUsers from './getUsers';
import likeUser from './likeUser';
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

router.post('/login', login);
router.get('/', authenticateUser, getUsers);
router.put('/', authenticateUser, likeUser);
router.delete('/', authenticateUser, blockUser);
router.post('/register', regFromValidation, register);
router.get('/notifications', authenticateUser, getNotification);
router.delete('/notifications', authenticateUser, postNotification);

export default router;
