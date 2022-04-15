var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs= require('fs')
var cookieParser = require('cookie-parser');//cookie
var logger = require('morgan');//日志
const session = require('express-session');
const RedisStore=require('connect-redis')(session);

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


const bolgRouter=require('./routes/blog')
const userRouter=require('./routes/user')


var app = express();

//view的渲染 不需要
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
const ENV=process.env.NODE_ENV
if(ENV!=='production'){
  app.use(logger('dev'))
}else{//线上环境
    const logFileName=path.join(__dirname, 'logs','access.log')
    const writestream=fs.createWriteStream(logFileName,{
      flags:'a'
    })
    app.use(logger('combined',{
      stream: writestream
    }))
}

app.use(express.json());//express.json() 处理json格式
app.use(express.urlencoded({ extended: false }));//其他格式
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret:'PITHY_@)@@>$>%',
  cookie: {
    // path: '/',   // 默认配置
    // httpOnly: true,  // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', bolgRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
