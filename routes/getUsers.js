const {queryDb} = require('../dbOperations');
require('dotenv').config();
const tableName = process.env.TABLE;

module.exports = async (req, res)=>{
    try{
        let result = await queryDb(`select email, name, imageUrl from ${tableName}`);
        result = result.rows;
        // list of people who have blocked the user
        let blockedBy = await queryDb(`select blockedBy from ${tableName} where email='${req.user.email}'`);
        console.log(req.user.email);
        blockedBy = blockedBy.rows[0].blockedby;
        if (blockedBy === null)
            blockedBy = [];
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
}