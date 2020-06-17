import {Request, Response} from 'express';
import {queryDb} from '../dbOperations';
import 'dotenv/config';
const tableName = process.env.TABLE;

export default async (req:Request, res:Response)=>{
    try{
        let result: any = await queryDb(`select email, name, imageUrl from ${tableName}`, []);
        result = result.rows;
        // list of people who have blocked the user
        let blockedBy: any = await queryDb(`select blockedBy from ${tableName} where email='${(req as any).user.email}'`, []);
        blockedBy = blockedBy.rows[0][0];
        if (blockedBy === null)
            blockedBy = [];
            result = result.filter((ele: Array<string>) => blockedBy.indexOf(ele[0]) === -1 && ele[0] !== (req as any).user.email);
            let notifications: any = await queryDb(`select notifications from ${tableName} where email='${(req as any).user.email}'`, []);
            // console.log(notifications.rows[0][0]);
            notifications = notifications.rows[0][0];
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