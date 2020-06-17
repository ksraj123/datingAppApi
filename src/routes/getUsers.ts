import {Request, Response} from 'express';
import {queryDb} from '../dbOperations';
require('dotenv').config();
const tableName = process.env.TABLE;

export default async (req:Request, res:Response)=>{
    try{
        let result: any = await queryDb(`select email, name, imageUrl from ${tableName}`, []);
        result = result.rows;
        // list of people who have blocked the user
        let blockedBy: any = await queryDb(`select blockedBy from ${tableName} where email='${(req as any).user.email}'`, []);
        console.log((req as any).user.email);
        console.log(blockedBy);
        blockedBy = blockedBy.rows[0].blockedby;
        if (blockedBy === null)
            blockedBy = [];
        interface userEle{
            email: string,
            name: string,
            imageUrl: string
        }
        result = result.filter((ele: userEle) => blockedBy.indexOf(ele.email) === -1 && ele.email !== (req as any).user.email);
        let notifications: any = await queryDb(`select notifications from ${tableName} where email='${(req as any).user.email}'`, []);
        notifications = notifications.rows[0].notifications;
        // console.log(blockedBy);
        res.json({
            status: "Success",
            email: (req as any).user.email,
            result,
            notificationCount: (notifications)? notifications.length : 0
        })
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}