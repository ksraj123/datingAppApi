import { Client, Configuration } from 'ts-postgres';
import 'dotenv/config';

const dbConfig: Configuration = {
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: parseInt(process.env.DBPORT + ""),
    database: process.env.DATABASE
};

let client = new Client(dbConfig);

export const connectToDb = async () => {
    await client.connect();
    try{
        console.log("Connected to db Successfully!");
    } catch (e) {
        console.log("Error While Connecting To DB");
        console.log(e);
    }
}

export const queryDb = async (query: string, values: Array<any>) => {
    try{
        let results = null;
        if (values.length !== 0)
            results = await client.query(query, values);
        else
            results = await client.query(query);
        return results;
    } catch (e) {
        console.log("Error Occured while Querying!")
        console.log(e);
    }
}

export const closeDb = async () => {
    try{
        await client.end();
    } catch (e) {
        console.log(e);
    }
}
