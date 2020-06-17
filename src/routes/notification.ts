import {Request, Response} from 'express';
import {queryDb} from '../dbOperations';
import 'dotenv/config';
const tableName = process.env.TABLE;

export const getNotification = async (req:Request, res:Response)=>{
    try{
        let result:any = await queryDb(`select notifications from ${tableName} where email='${(req as any).user.email}'`, []);
        res.json({
            status: "Success",
            email: (req as any).user.email,
            notifications: (result.rows[0][0])? result.rows[0][0] : 0
        })
    } catch (err){
        res.status(400).send(err);
    }
}

export const postNotification = async (req:Request, res:Response)=>{
    try{
        let result = await queryDb(`update ${tableName} set notifications=NULL where email='${(req as any).user.email}'`, []);
        res.json({
            status: "Success",
            email: (req as any).user.email,
            msg: "notifications deleted"
        })
    } catch (err){
        res.status(400).send(err);
    }
}
