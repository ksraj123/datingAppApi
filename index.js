const {userRouter} = require('./routes/userRoutes');
const {connectToDb} = require('./dbOperations');
const {authRouter} = require('./routes/auth');
const port = process.env.PORT || 3000;
const {setIO} = require('./sockets');
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
setIO(io);

require('dotenv').config();

connectToDb();

// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send(process.env.SECRET_KEY);
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})