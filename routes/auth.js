const {queryDb} = require('../dbOperations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
require('dotenv').config();
const tableName = process.env.TABLE;

module.exports.register = async (req, res)=>{
    try{
        // Email should be unique
        let result = await queryDb(`SELECT email FROM ${tableName} WHERE email='${req.body.email}'`);
        if (result.rowCount !== 0)  return res.status(400).send("Email already registered!");

        result = await queryDb(`select * from ${tableName}`);

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Providing Random image for now
        let imageUrl = await axios.get('https://randomuser.me/api/');
        imageUrl = imageUrl.data.results[0].picture.large;

        await queryDb(`INSERT INTO ${tableName}(id, name, email, password, imageUrl) VALUES($1, $2, $3, $4, $5)`,
        [result.rowCount+1, req.body.name, req.body.email, hashPassword, imageUrl])
        res.send(`Welcome! ${req.body.email}`);
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports.login = async (req, res)=>{
    try{
        let result = await queryDb(`SELECT password FROM ${tableName} WHERE email='${req.body.email}'`); 
        if (result.rowCount === 0)  return res.status(400).send("Email or password incorrect!");

        const passwordValid = await bcrypt.compare(req.body.password, result.rows[0].password);
        if (!passwordValid) return res.status(400).send("Invalid Password!");

        const token = jwt.sign({email: req.body.email}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);

    } catch (err) {
        res.status(400).send(err);
    }
}
