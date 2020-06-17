const {queryDb} = require('../dbOperations');
require('dotenv').config();
const tableName = process.env.TABLE;

//remove likes by each other on each other's profile when blocked
// give an obtion to unblock also
module.exports = async (req, res)=>{
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
}