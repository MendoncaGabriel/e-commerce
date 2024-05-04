const mysql = require('mysql2');
require('dotenv').config();

const host = 'database-gam.c3gcao0wi23m.us-east-1.rds.amazonaws.com'
const user = 'gabroviski'
const password = 'Gam1997Vsc'
const database = 'shopdamaquiagem'

// const host = process.env.LOCALADDRESS
// const user = process.env.USER
// const password = process.env.PASS
// const database = process.env.DATABASE



const db = mysql.createConnection({
    host: host,
    user: user, 
    password: password,
    database: database,
    port: 3306 
});

module.exports = db