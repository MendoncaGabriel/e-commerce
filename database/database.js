const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'database-gam.c3gcao0wi23m.us-east-1.rds.amazonaws.com',
    user: 'gabroviski', 
    password: 'Gam1997Vsc',
    database: 'shopdosbaloes',
    port: 3306 
});

module.exports = db