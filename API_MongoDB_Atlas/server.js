const restify = require('restify');
const bunyan = require('bunyan');
const mongoose = require('mongoose');
const errors = require('restify-errors');
const namespace = require('restify-namespace');
const rJwt = require('restify-jwt-community');
require('dotenv').config()

const log = bunyan.createLogger({
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

const server = restify.createServer({
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
 * Database Connection
 =================================================================== */
mongoose.connect(
    process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
const database = mongoose.connection;
database.on('error', (err) => {
    global.logger.error(err);
});

/*
 * Expose Routes once DB connects
 =================================================================== */
database.once('open', () => {
    console.log('Connected to Atlas');

    server.get('/', function (req, res, next) {
        res.send('...');
        next();
    });

    namespace(server, '/auth', function () {
        require('./routes/auth')(server);
    });
    namespace(server, '/api', function () {
        require('./routes/note')(server);
    });

    server.listen(process.env.PORT, () => {
        const connectMsg = `API is online ${process.env.PORT} ${process.env.ENV}`;
        console.log(connectMsg);
        global.logger.info(connectMsg);
    });
});