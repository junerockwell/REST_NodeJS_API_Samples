let restify = require('restify');
let bunyan = require('bunyan');

let _port_ = 3001; // production is 3000

let UserData = require('./AzureData/UserData.js');

let log = bunyan.createLogger({
    name: 'API',
    // level: process.env.LOG_LEVEL || 'info',
    // stream: process.stdout,
    // serializers: bunyan.stdSerializers
    streams: [{
        path: './main.log',
        // `type: 'file'` is implied
    }]
});

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


/*
 * Routes
 =================================================================== */
/* Main Route */
server.get('/', function (req, res, next) {
    res.send("Connected...");
    next();
});

server.post('/signup', (req, res, next) => {
    UserData.SignUp(req.body)
    .then(result => {
        res.send(result);
    });
    next();
});

server.post('/login', (req, res, next) => {
    UserData.LoginAUser(req.body)
    .then(result => {
        res.send(result);
    });
    next();
});









/*
 * Server listening ...
 =================================================================== */
server.listen(_port_, function () {
    console.log('API is online [production:' + (process.env.NODE_ENV == "production") + ']' );
});