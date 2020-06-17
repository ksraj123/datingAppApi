const authenticateUser = require('../authenticateUser');
const {queryDb} = require('../dbOperations');
const router = require('express').Router();
require('dotenv').config();
const tableName = "users";


// return to display list of users
router.get('/', authenticateUser, async (req, res)=>{
    try{
        let result = await queryDb(`select email, name, imageUrl from ${tableName}`);
        result = result.rows;
        // list of people who have blocked the user
        let blockedBy = await queryDb(`select blockedBy from ${tableName} where email='${req.user.email}'`);
        blockedBy = blockedBy.rows[0].blockedby;
        result = result.filter(res => blockedBy.indexOf(res.email) === -1 && res.email !== req.user.email);
        let notifications = await queryDb(`select notifications from ${tableName} where email='${req.user.email}'`);
        notifications = notifications.rows[0].notifications;
        // console.log(blockedBy);
        res.json({
            status: "Success",
            email: req.user.email,
            result,
            notificationCount: (notifications)? notifications.length : 0
        })
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

// like route
router.put('/', authenticateUser, async (req, res)=>{
    // req.body.email - email of user whose image is liked
    try {
        let likedBy = await queryDb(`select likedBy from ${tableName} where email='${req.body.email}'`); 
        likedBy = likedBy.rows[0].likedby;
        if (likedBy === null)
            likedBy = [];

        // console.log(likedBy);
        if (likedBy.indexOf(req.user.email) === -1){
            await queryDb(`update ${tableName} set likedBy=array_cat(likedBy, ARRAY['${req.user.email}']) where email='${req.body.email}'`);
            const notificationMsg = `${req.user.email} liked your profile`;
            await queryDb(`update ${tableName} set notifications=array_cat(notifications, ARRAY['${notificationMsg}']) where email='${req.body.email}'`);
            res.json({
                status: "Success",
                email: req.body.email,
                msg: "liked"
            })
        } else {
            res.json({
                status: "Fail",
                email: req.body.email,
                msg: 'user already liked'
            })
        }

    } catch(err){
        res.status(400).send(err);
    }
})

router.delete('/', authenticateUser, async (req, res)=>{
    // req.body.email - email of user to be blocked
    try{
        await queryDb(`update ${tableName} set blockedBy=array_cat(blockedBy, ARRAY['${req.user.email}']) where email='${req.body.email}'`);
        res.json({
            status: "Success",
            email: req.body.email,
            msg: "blocked"
        });
    } catch (err){
        res.status(400).send(err);
    }
})

router.get('/notifications', authenticateUser, async (req, res)=>{
    try{
        let result = await queryDb(`select notifications from ${tableName} where email='${req.user.email}'`);
        res.json({
            status: "Success",
            email: req.user.email,
            notifications: result.rows[0].notifications
        })
    } catch (err){
        res.status(400).send(err);
    }
})

// frontend will send delete request after sucessfully fetching and viewing notifications after login 
router.delete('/notifications', authenticateUser, async (req, res)=>{
    try{
        let result = await queryDb(`update ${tableName} set notifications=NULL where email='${req.user.email}'`);
        res.json({
            status: "Success",
            email: req.user.email,
            msg: "notifications deleted"
        })
    } catch (err){
        res.status(400).send(err);
    }
})

module.exports.userRouter = router;
