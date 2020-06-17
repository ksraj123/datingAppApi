const {queryDb} = require('../dbOperations');
require('dotenv').config();
const tableName = process.env.TABLE;

const getNotification = async (req, res)=>{
    try{
        let result = await queryDb(`select notifications from ${tableName} where email='${req.user.email}'`, []);
        res.json({
            status: "Success",
            email: req.user.email,
            notifications: result.rows[0].notifications
        })
    } catch (err){
        res.status(400).send(err);
    }
}

const postNotification = async (req, res)=>{
    try{
        let result = await queryDb(`update ${tableName} set notifications=NULL where email='${req.user.email}'`, []);
        res.json({
            status: "Success",
            email: req.user.email,
            msg: "notifications deleted"
        })
    } catch (err){
        res.status(400).send(err);
    }
}

module.exports = {
    getNotification,
    postNotification
}