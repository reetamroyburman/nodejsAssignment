const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

let connection;

async function createConnection() {
    if(!connection) {
        connection = await mysql.createConnection(connectionConfig);
    }
}

async function executeQuery(query, values) {
    if(!connection) {
        await createConnection();
    }
    return await connection.execute(query, values);
}

module.exports = {createConnection, executeQuery};