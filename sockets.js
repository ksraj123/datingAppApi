// on liking - we will send post request to backend and the post request which will contains the details of the user
// whose image we liked, we will store it in notifications database,
// we will find the correspoing socket for that user and emit a notification event which the front end will handale

// some client code
// const socket = io.connect('http://localhost:3000');
// socket.emit('login', {email: "saurabh"})
// socket.emit('logout')

let connections = [];

const setIO = (io) => {

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

}

const getConnections = () => {
    return connections;
}

module.exports.getConnections = getConnections;
module.exports.setIO = setIO;