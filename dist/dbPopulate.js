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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbOperations_1 = require("./dbOperations");
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const tableName = process.env.TABLE;
const numMockUsers = 20;
const mockUserData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbOperations_1.connectToDb();
        yield dbOperations_1.queryDb(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id integer,
            email text,
            name text,
            password text,
            imageUrl text,
            likedBy text[],
            notifications text[],
            blockedBy text[]
        );`, []);
        for (let i = 0; i < numMockUsers; i++) {
            let axiosRes = yield axios_1.default({
                method: "GET",
                url: 'https://randomuser.me/api/'
            });
            console.log("here");
            let res = axiosRes.data.results[0];
            // console.log(res);
            // res = res.data.results[0];
            console.log("Fetched Fake User From API");
            const fakeUser = [i, `${res.name.first} ${res.name.last}`, res.email, res.login.sha256, res.picture.large];
            yield dbOperations_1.queryDb(`INSERT INTO ${tableName}(id, name, email, password, imageUrl) VALUES($1, $2, $3, $4, $5)`, fakeUser);
        }
        yield dbOperations_1.closeDb();
    }
    catch (e) {
        console.log(e);
    }
});
mockUserData();
