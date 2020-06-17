"use strict";
const { connectToDb } = require('./dbOperations');
const port = process.env.PORT || 3000;
const apiRouter = require('./routes');
// const {setIO} = require('./sockets');
const express = require('express');
const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
// setIO(io);
connectToDb();
// Middleware
app.use(express.json());
// Route Middlewares
app.use('/api/user', apiRouter);
// app.get('/', (req, res) => {
//     res.send(process.env.SECRET_KEY);
// })
app /*server*/.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
