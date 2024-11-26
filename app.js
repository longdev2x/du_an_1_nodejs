//Khai báo thư viện
var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const database = require('./config/db');

//import route
var indexRouter = require('./routes/index');
var publicRoute = require('./routes/public.routes');
var oauthRoute = require('./routes/oauth.routes');
var timeSheetsRoute = require('./routes/timeSheets.routes');
var trackingRoute = require('./routes/tracking.routes');
var usersRoute = require('./routes/users.routes');
// var postsRoute = require('./routes/posts.routes');
// var notificationsRoute = require('./routes/notifications.routes');

//Khởi tạo app
var app = express();
//Connect db
database.connect();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//cần cho phía mobile kết nối
app.use(cors());
//Bảo vệ api
app.use(helmet());

// router
app.use('/', indexRouter);
app.use('/public', publicRoute); // (config, uploadFile, images, signUP)
app.use('/oauth', oauthRoute); //(login, logout, token)
app.use('/time-sheets', timeSheetsRoute); // TimeSheet
app.use('/tracking', trackingRoute); // Tracking
app.use('/users', usersRoute);  // Users
// app.use('/posts', postsRoute);  // Post
// app.use('/notifications', notificationsRoute); // Notifications


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



/* 
/public/config-app   GET
/public/uploadFile  POST
/public/images/{name} GET
/public/sign  ---  route này là để đăng ký done

/oauth/logout  DELETE
/oauth/token POST

//Tất cả đều cần verify token
/users/get-user-current GET response 200 trả về User
/users/update-myself/ POT (body - user *) response user
/users/update/{id}  POT (body - user *, path - id) response user - only for Admin Role
/users/token-device  GET (queryParam tokenDevice *) respons user - nhận và lưu deviceToken vào User
/users/searchByPage 

/time-sheets GET (response 200 - List<TimeSheetSchema>) - required token
/time-sheets/check-in GET (query ip *) - required token

//Tất cả đều cần verify token
/tracking  GET resonse 200 là List của Tracking
/tracking  POST (body - content *, date *, user ) resonse là json Tracking
/tracking/{id}  POST (body - content *, date *, user + path - id ) response là json Tracking
/tracking/{id} DELETE (path id)

/posts/get-news 
/posts/create 
/posts/likes/{id} 
/posts/comments/{id} 
/posts/update/{id} 

/notifications 
/notifications/test-push 

 */