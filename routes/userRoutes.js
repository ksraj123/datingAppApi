const authenticateUser = require('../authenticateUser');
const {queryDb} = require('../dbOperations');
const router = require('express').Router();
require('dotenv').config();
const tableName = "users";


// return to display list of users
router.get('/', authenticateUser, async (req, res)=>{
    try{
        let result = await queryDb(`select email, name, imageUrl from ${tableName}`);
        // list of people who have blocked the user
        let blockedBy = await queryDb(`select blockedBy from ${tableName} where email='${req.user.email}'`);
        blockedBy = blockedBy.rows[0].blockedby;
        result = result.rows;
        result = result.filter(res => blockedBy.indexOf(res.email) === -1 && res.email !== req.user.email);
        // console.log(blockedBy);
        res.json({
            email: req.user.email,
            result,
            notificationCount: 1 // number of notifications
        })
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

// like route
router.put('/', authenticateUser, async (req, res)=>{
    // req.body.email - email of user whose image is like
    try {
        let result = await queryDb(`select likedBy from ${tableName} where email='${req.body.email}')`);

        await queryDb(`update ${tableName} set likedBy=array_cat(blockedBy, ARRAY['${req.user.email}'])`);
    } catch(err){
        res.status(400).send(err);
    }
})

router.delete('/', authenticateUser, async (req, res)=>{
    // req.body.email - email of user to be blocked
    try{
        await queryDb(`update ${tableName} set blockedBy=array_cat(blockedBy, ARRAY['${req.user.email}']) where email='${req.body.email}'`);
        res.json({
            email: req.body.email,
            msg: "user blocked"
        });
    } catch (err){
        res.status(400).send(err);
    }
})

module.exports.userRouter = router;
