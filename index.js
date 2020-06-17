const {authRouter, initAuthGlobals} = require('./routes/auth');
const {userRouter, initUserGlobals} = require('./routes/userRoutes');
const {connectToDb} = require('./dbOperations');
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
let connections = [];

const server = require('http').Server(app);
const io = require('socket.io')(server);

let dbClient = null;
require('dotenv').config();

const dbConfig = {
    user: "postgres",
    password: "password",
    host: "127.0.0.1",
    port: "5432",
    database: "dating"
};

const initiliazieDbClient = async()=>{
    dbClient = await connectToDb(dbConfig);
    initAuthGlobals(dbClient);
    initUserGlobals(dbClient);
}
initiliazieDbClient();

// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send(process.env.SECRET_KEY);
})

// on liking - we will send post request to backend and the post request which will contains the details of the user
// whose image we liked, we will store it in notifications database,
// we will find the correspoing socket for that user and emit a notification event which the front end will handale

// some client code
// const socket = io.connect('http://localhost:3000');
// socket.emit('login', {email: "saurabh"})
// socket.emit('logout')

io.on('connection', (socket)=>{

    // upon successful login frontend will emit 'login'
    socket.on('login', (data)=>{
        // socket of logged in users will be saved in connections
        console.log("Login Event Tracked!");
        connections.push({
            email: data.email,
            socket: socket
        })
        console.log(`Number of Connections ${connections.length}`);
    })

    // on logout frontend will emit 'logout' which will remove the socket from connections list
    socket.on('logout', ()=>{
        console.log("Logout Event Tracked!");
        connections = connections.filter((ele)=>{
            return (ele.socket !== socket)
        })
        console.log(`Number of Connections ${connections.length}`);

    })

    socket.on('disconnect', ()=>{
        console.log("Disconnec event!");
        connections = connections.filter((ele)=>{
            return (ele.socket != socket)
        })
        console.log(`Number of Connections ${connections.length}`);
    })

})

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})