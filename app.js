var express = require('express');
    mongooseAuth = require('mongoose-auth');
var everyauth = require('./node_modules/mongoose-auth/node_modules/everyauth');
everyauth.debug = process.env.NODE_ENV === 'production' ? false : true;
var RedisStore = require('connect-redis')(express);
var redisAuthDbName = 'kindzy_auth_' + process.env.NODE_ENV;

require('./models/db_connect');

// TODO Figure out how to include the mongooseAuth.middleware() without instatiating a User before
User = require('./models/user');

var app = module.exports = express.createServer(
  express.bodyParser(),
  express.methodOverride(),
  express.cookieParser(),
  express.session({secret: 'kinsecretkey83', store: new RedisStore({db: redisAuthDbName})}),
  require('stylus').middleware({ src: __dirname + '/public' }),
  express.static(__dirname + '/public'),
  mongooseAuth.middleware()
);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

require('./routes/auth')(app);
require('./routes/site')(app);
require('./routes/sockets')(app);
require('./routes/notifications')(app);
require('./routes/comments')(app);
require('./routes/messages')(app);
require('./routes/profiles')(app);
require('./routes/friend_requests')(app);
require('./routes/tags')(app);

mongooseAuth.helpExpress(app);

app.listen(process.env.PORT || 6986);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
