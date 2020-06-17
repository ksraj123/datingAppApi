const {regFromValidation} = require('../validation');
const {queryDb} = require('../dbOperations');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const tableName = "users";
require('dotenv').config();

const global = {dbClient: null};

const initAuthGlobals = (client)=>{
    global.dbClient = client;
}

router.post('/register', regFromValidation, async (req, res, next)=>{
    try{
        // Email should be unique
        let result = await queryDb(global.dbClient, `SELECT email FROM ${tableName} WHERE email='${req.body.email}'`);
        if (result.rowCount !== 0)  return res.status(400).send("Email already registered!");

        result = await queryDb(global.dbClient, `select * from ${tableName}`);

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Providing Random image for now
        let imageUrl = await axios.get('https://randomuser.me/api/');
        imageUrl = imageUrl.data.results[0].picture.large;

        await global.dbClient.query(`INSERT INTO ${tableName}(id, name, email, password, imageUrl) VALUES($1, $2, $3, $4, $5)`,
        [result.rowCount+1, req.body.name, req.body.email, hashPassword, imageUrl])
        res.send(`Welcome! ${req.body.email}`);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res, next)=>{
    try{
        let result = await queryDb(global.dbClient, `SELECT password FROM ${tableName} WHERE email='${req.body.email}'`); 
        if (result.rowCount === 0)  return res.status(400).send("Email or password incorrect!");

        const passwordValid = await bcrypt.compare(req.body.password, result.rows[0].password);
        if (!passwordValid) return res.status(400).send("Invalid Password!");

        const token = jwt.sign({email: req.body.email}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);

    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports.authRouter = router;
module.exports.initAuthGlobals = initAuthGlobals;
