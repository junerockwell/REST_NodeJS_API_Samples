const mysql = require('mysql');

const DB = function() {
	this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        port: process.env.DB_PORT,
        // debug: process.env.ENV === 'development' || false
    });
};

module.exports = new DB();