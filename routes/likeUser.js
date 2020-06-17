const {queryDb} = require('../dbOperations');
const tableName = "users";

module.exports = async (req, res)=>{
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
}