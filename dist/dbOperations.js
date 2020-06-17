"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDb = exports.queryDb = exports.connectToDb = void 0;
const ts_postgres_1 = require("ts-postgres");
require("dotenv/config");
const dbConfig = {
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: parseInt(process.env.DBPORT + ""),
    database: process.env.DATABASE
};
let client = new ts_postgres_1.Client(dbConfig);
exports.connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    try {
        console.log("Connected to db Successfully!");
    }
    catch (e) {
        console.log("Error While Connecting To DB");
        console.log(e);
    }
});
exports.queryDb = (query, values) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let results = null;
        if (values.length !== 0)
            results = yield client.query(query, values);
        else
            results = yield client.query(query);
        return results;
    }
    catch (e) {
        console.log("Error Occured while Querying!");
        console.log(e);
    }
});
exports.closeDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.end();
    }
    catch (e) {
        console.log(e);
    }
});
