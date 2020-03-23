var db = {
  development : {
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'node_mysql',
    port: 3306,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    // debug: true
  },
  production : {
    host     : '',
    user     : '',
    password : '',
    database : ''
  }
};

var isProduction = process.env.NODE_ENV == 'production';
var exports = {
  db: isProduction ? db.production : db.development
};
// console.log(exports);

module.exports = exports;
