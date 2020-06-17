import {Request, Response} from 'express';
import {queryDb} from '../dbOperations';
import 'dotenv/config';
const tableName = process.env.TABLE;

//remove likes by each other on each other's profile when blocked
// give an obtion to unblock also
export default async (req: Request, res: Response)=>{
    // req.body.email - email of user to be blocked
    try{
        console.log((req as any).user.email);
        await queryDb(`update ${tableName} set blockedBy=array_cat(blockedBy, ARRAY['${(req as any).user.email}']) where email='${req.body.email}'`, []);
        res.json({
            status: "Success",
            email: req.body.email,
            msg: "blocked"
        });
    } catch (err){
        res.status(400).send(err);
    }
}