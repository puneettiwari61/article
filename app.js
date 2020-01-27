var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var middleware = require('./modules/middleware')
//connecting to database 
mongoose.connect('mongodb://uyfexi7yktegd9zbusm3:EPr5L5Lhb2fFimyTh3fT@bzddcpiz6r7ngo5-mongodb.services.clever-cloud.com:27017/bzddcpiz6r7ngo5',{ useNewUrlParser: true,
useUnifiedTopology: true },(err) => {
  console.log('connected',err?false:true);
})


var indexRouter = require('./routes/index');
var articlesRouter = require('./routes/articles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret:'helloworld',
  resave:true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use(flash())
app.use(middleware.loggedUserInfo);

app.use('/', indexRouter);
app.use('/articles', articlesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
