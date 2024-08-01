var createError = require('http-errors');
var express = require('express');
const exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
require('./model/product');
require('./model/API');
require('./model/user');
require('./model/CartModel');

var usersRouter = require('./routes/usersRouter');
var CartRouter = require('./routes/CartRoutes');
var APIRouter = require('./routes/APIRouter');
var productRouter = require('./routes/productRouter');
var indexRouter = require('./routes/index');

var app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-config');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Cấu hình Handlebars
const hbs = exphbs.create({
  defaultLayout: 'main', // Layout mặc định
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  extname: '.hbs',
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Đăng ký các routes
app.use('/users', usersRouter);
app.use('/API', APIRouter);
app.use('/product', productRouter);
app.use('/cart', CartRouter);
app.use('/', indexRouter);

// Kết nối MongoDB
mongoose.connect('mongodb+srv://Quangthong:Ec2zy4nb.zhX93z@cluster0.cypkh4s.mongodb.net/project_cro102', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
.catch(err => console.log('>>>>>>>>> DB Error: ', err));

// Xử lý lỗi 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Xử lý lỗi
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
