"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbOperations_1 = require("./dbOperations");
const port = process.env.PORT || 3000;
const routes_1 = __importDefault(require("./routes"));
const sockets_1 = require("./sockets");
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const server = require('http').Server(app);
const io = require('socket.io')(server);
sockets_1.setIO(io);
dbOperations_1.connectToDb();
// Middleware
app.use(express_1.default.json());
// Route Middlewares
app.use('/api/user', routes_1.default);
// app.get('/', (req, res) => {
//     res.send(process.env.SECRET_KEY);
// })
server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
