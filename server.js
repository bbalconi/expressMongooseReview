var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var uriUtil = require('mongodb-uri');
var Chair = require('./models/chair.js');

app.use(express.static('public'));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

var mongodbUri = 'mongodb://localhost/chairs';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

mongoose.connect(mongooseUri, options);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('we have database chairs connected');
});

app.post('/chairs', function (req, res, next) {
  var chair = new Chair();
  chair.type = req.body.type;
  chair.model = req.body.model;
  chair.save(function (err, chairReturned) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.json('chair put in db: ' + chairReturned.model);
    }
  });
});

app.get('/chairs', function (req, res, next) {
  Chair.find(function (err, chairs) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.json(chairs);
    }
  });
});

app.put('/chairs', function (req, res, next) {
  Chair.findById(req.body.id, function (err, chair) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      chair.type = req.body.type;
      chair.model = req.body.model;
      chair.save(function(err, chairReturned){
        if(err){
          console.log(err);
          next(err);
        } else {
          res.json('chair updated in db' + chairReturned.model);
        }
      });
    }
  });
});

app.delete('/chairs/:chairId', function(req, res, next){
  Chair.findByIdAndRemove(req.params.chairId, function(err, chair) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.json("successfully deleted a chair from db: " + chair.model);
    }
  });
});

var port = 5000;

app.listen(port, function () {
  console.log("Listening on " + port);
});