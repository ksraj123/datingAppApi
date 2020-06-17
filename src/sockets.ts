let connections: Array<any> = [];

export const setIO = (io: any) => {

    io.on('connection', (socket: any)=>{

        // upon successful login frontend will emit 'login'
        socket.on('login', (data: any)=>{
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

export const getConnections = () => {
    return connections;
}