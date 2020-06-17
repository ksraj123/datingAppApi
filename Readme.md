# Dating App

- Author: Kumar Saurabh Raj
- Technologies Used: Javascipt, Web Sockets(Socket.IO), NodeJs, Express

## Description of Routes

    POST    /api/user/login
    POST    /api/user/regiser
    GET     /api/user               - Sends list of users to display for the logged-in user
    PUT     /api/user               - updates DB and emits socket event when user liked
    DELETE  /api/user               - blocks user and updates DB
    GET     /api/user/notifications - Sends list of notifications to frontend
    DELETE  /api/user/notifications - After viewing notifications, requested by frontend

## Expectations from frontend

This repo has only the backed for the application, Its designed with some expectations from frontend which are listed below:-

### Route - Expectations

### Websocket - Expectations

The frontend should open a websocket connection, for example

    const socket = io.connect('http://localhost:3000');

Upon successful login frontend should emit `login` event with the email of logged in user as data, for example

    socket.emit('login', {email: "saurabh@example.com"})

The front should handle `notification` events and should recieve data which contains notification message and update UI accordingly, for example

    socket.on('notification', (data) => {
        console.log(data.notification);
    });

Upon sucessfully logging out, front end should emit `logout` event with `email` as data, for example

    socket.emit('logout', {email: "saurabh"})

## Setup and Testing

Following are required for testing

- [Postman](https://www.postman.com/)

- [socket.io-client](https://github.com/socketio/socket.io-client) or a [CDN](https://cdnjs.com/libraries/socket.io) for it

### Testing - Steps

- **Step 1**: Start Postgresql, create a database, a table inside it and Provide ncessary environemnt variables, install dependecies with the command `npm install`

- **Step 2**: Run the command `npm test` to populate the database with mock data and make required tables and columns then run the command `npm start` to start the web server

- **Step 3**: Create an html file like this on open it in two different tabs

```html
    <!DOCTYPE html>
    <html>
    <head>
        <title>Socket IO Testing</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
    </head>
    <body>
        <script type="text/javascript">
            const socket = io.connect('http://localhost:3000');
            socket.on('notification', (data) => {
                console.log(data.notification);
            });
        </script>
    </body>
    </html>
```

- **Step 4**: Open two tabs of Postman and register two users. To register a user send `POST` request `/api/user/register` with the body as `application/json` of the following format

    {
        "name": "Saurabh"
        "email": "Saurabh@example.com",
        "password": "superSecretPassword"
    }

- **Step 5**: Login through the two accounts, Send `POST` requests to `/api/user/login` with the  with the body as `application/json` of the following format

    {
        "email": "Saurabh@example.com",
        "password": "superSecretPassword"
    }

- **Step 6**: Copy the token value recieved from the previous step and send a `GET` request to `/api/user`, add the key `auth-token` to header with copied value as value. You will get a list of users visible to the account as response.

- **Step 7**: Open browser console and execute the following command with respective email ids for the two acconts to emit login events to websockets

    socket.emit('login', {email: "Email here"})

- **Step 8**: Send `PUT` request to `/api/user` to like an user with the following body as `application/json` of the following format

    {
        "email": "email here",
        "password": "superSecretPassword"
    }

- **Step 9**: Look for the notification message in the console of the liked user for notification mesasge.
