const express = require('express'),
  mysql = require('mysql'),
  myConnection = require('express-myconnection'),
  fs = require('fs'),
  PDFDocument = require('pdfkit'),
  blobStream = require('blob-stream'),
  expressHbs = require('express-handlebars');
  //.create({defaultLayout: 'main'});

const app = express();
const routes = require('./routes/index');

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(require('body-parser').urlencoded({extended: true}));

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users'
};

app.use(myConnection(mysql, dbConfig, 'request'));

app.use('/', routes);


app.listen(3000, function() {
  console.log('Listen on port 3000');
});
