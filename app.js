var createError = require('http-errors');
var express = require('express');
const exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
require('./model/user_asm_kotlin')
require('./model/product_kotlin')


 var user_asm_kotlinRouter = require('./routes/user_asm_kotlinRouter');
 var product_kotlinRouter = require('./routes/product_kotlinRouter');

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

app.use('/userKotlin', user_asm_kotlinRouter);
app.use('/product', product_kotlinRouter);

// Kết nối MongoDB
//'mongodb://127.0.0.1:27017/project_cro102'
//'mongodb+srv://Quangthong:Ec2zy4nb.zhX93z@cluster0.cypkh4s.mongodb.net/project_cro102' public
mongoose.connect('mongodb+srv://quangthong2004:thong2004@cluster0.vpo8x.mongodb.net/user_kotlin', {
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
