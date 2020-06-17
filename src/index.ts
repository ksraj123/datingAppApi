import {connectToDb} from './dbOperations';
const port = process.env.PORT || 3000;
import apiRouter from './routes';
import {setIO} from './sockets';
import express from 'express';
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

setIO(io);
connectToDb();

// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/user', apiRouter);

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})