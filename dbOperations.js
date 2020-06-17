const {Client} = require('pg');

require('dotenv').config();

const connect = async (dbConfig) => {
    const client = new Client(dbConfig);
    try{
        await client.connect();
        console.log("Connected to db Successfully!");
    } catch (e) {
        console.log("Error While Connecting To DB");
        console.log(e);
    } finally {
        return client;
    }
}

const queryDb = async (dbClient, query) => {
    try{
        const results = await dbClient.query(query);
        return results;
    } catch (e) {
        console.log("Error Occured while Querying!")
        console.log(e);
    }
}

module.exports.queryDb = queryDb;
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