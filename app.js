require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const cors = require('cors');
app.use(cors({origin: "*"}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Autorise toutes les origines
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  res.setHeader(
      "Content-Security-Policy",
      "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src *; style-src * 'unsafe-inline';"
  );

  next();
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
