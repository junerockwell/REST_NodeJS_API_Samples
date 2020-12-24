require('dotenv').config();
const restify = require('restify');
const bunyan = require('bunyan');
const errors = require('restify-errors');
const namespace = require('restify-namespace');
const rJwt = require('restify-jwt-community');
const db = require('./MySQLData');

let log = bunyan.createLogger({
    name: 'API',
    // level: process.env.LOG_LEVEL || 'info',
    // stream: process.stdout,
    serializers: errors.bunyanSerializer.create({
        topLevelFields: true
    }),
    streams: [{
        path: './main.log',
        // `type: 'file'` is implied
    }]
});
global.logger = log;

let server = restify.createServer({
	log: log,
    name: 'API'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser());
// server.use(restify.bodyParser());
server.use(restify.plugins.bodyParser({
    // maxBodySize: 0,
    // uploadDir: os.tmpdir(),
    multiples: true
}));
server.use(restify.plugins.throttle({
    burst: 100,
    rate: 50,
    ip: true,
    overrides: {
        '127.0.0.1': {
            rate: 0, // unlimited
            burst: 0
        }
    }
}));

// server.use(restify.CORS());
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);


// server.on('after', restify.plugins.auditLogger({ log: log }));
// server.on('after', restify.plugins.auditLogger({
//   log: log
//   event: 'after',
//   server: SERVER,
//   logMetrics : logBuffer,
//   printLog : true
// }));

server.use(function authenticate(req, res, next) {
    next();
});

server.use(function slowPoke(req, res, next) {
    setTimeout(next.bind(this), parseInt((process.env.SLEEP_TIME || 0), 10));
});

server.use(rJwt({ secret: process.env.JWT_SECRET }).unless({ path: ['/auth/login', '/auth/register']}));

/*
 * Expose the endpoints after successful DB Connection and 
 * start the app.
 =================================================================== */
db.pool.getConnection(err => {
    if (err) {
        console.error(err);
        return;
    }
    
    const dbConnectMsg = 'Connected to MySQL Database!';
    console.log(dbConnectMsg);
    global.logger.info(dbConnectMsg);

    server.get('/', function (req, res, next) {
        res.send("Connected...");
        next();
    });
    
    namespace(server, '/auth', () => {
        require('./routes/auth')(server);
    });
    namespace(server, '/api', () => {
        require('./routes/note')(server);
    });

    server.listen(process.env.API_PORT, function () {
        const appLiveMsg = `API is online ${process.env.API_PORT} ${process.env.ENV}`;
        console.log(appLiveMsg);
        global.logger.info(appLiveMsg);
    });
});


