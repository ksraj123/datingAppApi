const {Client} = require('pg');
let client = null;

require('dotenv').config();

const dbConfig = {
    user: "postgres",
    password: "password",
    host: "127.0.0.1",
    port: "5432",
    database: "dating"
};

const connect = async () => {
    client = new Client(dbConfig);
    try{
        await client.connect();
        console.log("Connected to db Successfully!");
    } catch (e) {
        console.log("Error While Connecting To DB");
        console.log(e);
    }
}

const queryDb = async (query, values) => {
    try{
        let results = null;
        if (values)
            results = await client.query(query, values);
        else
            results = await client.query(query);
        return results;
    } catch (e) {
        console.log("Error Occured while Querying!")
        console.log(e);
    }
}

const closeDb = async () => {
    try{
        await client.end();
    } catch (e) {
        console.log(e);
    }
}

module.exports.queryDb = queryDb;
module.exports.closeDb = closeDb;
module.exports.connectToDb = connect;

/*
client.connect()
.then(()=> console.log("Connected Successfully!"))
.then(()=>client.query("INSERT INTO users(id, name) VALUES($1, $2)", ["1", "Saurabh"]))
.then(()=>client.query("select * from users"))
.then(results => console.table(results.rows))
.catch(e => console.log(e))
.finally(() => client.end())
*/