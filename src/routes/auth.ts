import {queryDb} from '../dbOperations';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import 'dotenv/config';
const tableName = process.env.TABLE;

export const register = async (req:Request, res:Response)=>{
    try{
        // Email should be unique
        let result: any = await queryDb(`SELECT email FROM ${tableName} WHERE email='${req.body.email}'`, []);
        if (result.rows.length !== 0)  return res.status(400).send("Email already registered!");

        result = await queryDb(`select * from ${tableName}`, []);

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Providing Random image for now
        let imageUrl = await axios({
            method: "GET",
            url: "https://randomuser.me/api/"
        });
        imageUrl = imageUrl.data.results[0].picture.large;

        await queryDb(`INSERT INTO ${tableName}(id, name, email, password, imageUrl) VALUES($1, $2, $3, $4, $5)`,
        [result.rowCount+1, req.body.name, req.body.email, hashPassword, imageUrl])
        res.json({
            status: "Success",
            email: req.body.email,
            msg: "registeration successful"
        });
    } catch (err) {
        res.status(400).send(err);
    }
}

export const login = async (req:Request, res:Response)=>{
    try{
        let result:any = await queryDb(`SELECT password FROM ${tableName} WHERE email='${req.body.email}'`, []);
        if (result.rows.length === 0)  return res.status(400).json({
            status: "Fail",
            msg: "Email or password incorrect!"
        });
        
        const passwordValid = await bcrypt.compare(req.body.password, result.rows[0][0]);
        if (!passwordValid) return res.status(400).json({
            status: "Fail",
            msg: "Invalid Password!"
        });

        const token = jwt.sign({email: req.body.email}, process.env.TOKEN_SECRET || "secret");
        res.header('auth-token', token).send(token);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}
