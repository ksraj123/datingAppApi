const {connectToDb} = require('./dbOperations');
const axios = require('axios');
const numMockUsers = 20;
const tableName = "users";

require('dotenv').config();

const dbConfig = {
    user: "postgres",
    password: "password",
    host: "127.0.0.1",
    port: "5432",
    database: "dating"
};

let dbClient = null;
const initiliazieDbClient = async()=>{
    dbClient = await connectToDb(dbConfig);
    mockUserData();
}
initiliazieDbClient();

const mockUserData = async () => {
    await dbClient.query(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id integer,
        email text,
        name text,
        password text,
        imageUrl text,
        likedBy text[],
        notifications text[],
        blockedBy text[]
    );`);

    for (let i = 0; i < numMockUsers; i++){
        let res = await axios.get('https://randomuser.me/api/');
        res = res.data.results[0];
        // console.log(res);
        const fakeUser = [i, `${res.name.first} ${res.name.last}`, res.email, res.login.sha256, res.picture.large];
        await dbClient.query(`INSERT INTO ${tableName}(id, name, email, password, imageUrl) VALUES($1, $2, $3, $4, $5)`,
            fakeUser);
    }

    await dbClient.end();
}
