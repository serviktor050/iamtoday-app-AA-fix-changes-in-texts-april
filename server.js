var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    path = require('path')







var app = express();
app.set('port', 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));



const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
//const config = require('./webpack.config.js');

  app.use(express.static(__dirname + '/build'));
  app.get('*', function response(req, res) {
    console.log('__dirname-express')
    console.log(__dirname)
    res.sendFile(path.join(__dirname, 'build/index.html'));
  });


// Starting express server
http.createServer(app).listen(app.get('port'), 'localhost', function () {
  console.log('Express server listening on port ' + app.get('port'));
});