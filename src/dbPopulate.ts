import {connectToDb, queryDb, closeDb} from './dbOperations';
import axios from 'axios';
require('dotenv').config();
const tableName = process.env.TABLE;
const numMockUsers = 20;

const mockUserData = async () => {
    try{
        await connectToDb();
        await queryDb(`
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

        for (let i = 0; i < numMockUsers; i++){
            let axiosRes = await axios({
                method: "GET",
                url: 'https://randomuser.me/api/'
            });
            console.log("here");
            let res = axiosRes.data.results[0];
            // console.log(res);
            // res = res.data.results[0];
            console.log("Fetched Fake User From API");
            const fakeUser = [i, `${res.name.first} ${res.name.last}`, res.email, res.login.sha256, res.picture.large];
            await queryDb(`INSERT INTO ${tableName}(id, name, email, password, imageUrl) VALUES($1, $2, $3, $4, $5)`,
                fakeUser);
            
        }
        await closeDb();
    }
    catch(e){
        console.log(e);
    }
}

mockUserData();
