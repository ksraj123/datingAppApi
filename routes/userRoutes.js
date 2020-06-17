const {getNotification, postNotification} = require('./notification');
const authenticateUser = require('../authenticateUser');
const {regFromValidation} = require('../validation');
const {queryDb} = require('../dbOperations');
const router = require('express').Router();
const blockUser = require('./blockUser');
const getUsers = require('./getUsers');
const likeUser = require('./likeUser');
require('dotenv').config();
const tableName = "users";


// return to display list of users
router.get('/', authenticateUser, getUsers);

// like route
router.put('/', authenticateUser, likeUser)

router.delete('/', authenticateUser, blockUser);

router.get('/notifications', authenticateUser, getNotification);

// frontend will send delete request after sucessfully fetching and viewing notifications after login 
router.delete('/notifications', authenticateUser, postNotification);

module.exports.userRouter = router;
