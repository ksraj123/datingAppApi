const authenticateUser = require('../authenticateUser');
const {queryDb} = require('../dbOperations');
const router = require('express').Router();
require('dotenv').config();
const tableName = "users";


// return to display list of users
router.get('/', authenticateUser, async (req, res)=>{
    console.log("here!");        
    try{
        let result = await queryDb(`select email, name, imageUrl from ${tableName}`);
        res.json({
            email: req.user.email,
            results: result.rows
        })
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

router.put('/like', authenticateUser, (req, res)=>{
    req.body.email
})

module.exports.userRouter = router;
