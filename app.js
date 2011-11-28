var express = require('express');
//    mongooseAuth = require('mongoose-auth');
//var everyauth = require('./node_modules/mongoose-auth/node_modules/everyauth');
//everyauth.debug = true;

require('./models/db_connect');

// TODO Figure out how to include the mongooseAuth.middleware() without instatiating a User before 
//User = require('./models/user');

var app = module.exports = express.createServer(
  express.bodyParser(),
  express.methodOverride(),
  express.cookieParser(),
  express.session({secret: 'kinsecretkey83'}),
  require('stylus').middleware({ src: __dirname + '/public' }),
  express.static(__dirname + '/public')
//  mongooseAuth.middleware()
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
require('./routes/site')(app);
require('./routes/users')(app);
require('./routes/day_cares')(app);

//mongooseAuth.helpExpress(app);

app.listen(6986);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
