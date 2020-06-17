const router = require('express').Router();
const authenticateUser = require('../authenticateUser');
require('dotenv').config();

const global = {dbClient: null};
const tableName = "users";

const initUserGlobals = (client)=>{
    global.dbClient = client;
}

// return to display list of users
router.get('/', authenticateUser, async (req, res)=>{
    try{
        let result = await global.dbClient.query(`select email, name, imageUrl from ${tableName}`);
        res.json({
            email: req.user.email,
            results: result.rows
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

router.put('/like', authenticateUser, (req, res)=>{
    req.body.email
})

module.exports.userRouter = router;
module.exports.initUserGlobals = initUserGlobals;