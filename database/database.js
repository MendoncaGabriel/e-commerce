const mysql = require('mysql2');
require('dotenv').config();

const host = process.env.LOCALADDRESS
const user = process.env.USER
const password = process.env.PASS
const database = process.env.DATABASE



const db = mysql.createConnection({
    host: host,
    user: user, 
    password: password,
    database: database,
    port: 3306 
});

module.exports = db