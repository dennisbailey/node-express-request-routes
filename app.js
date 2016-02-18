var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

app.get('/', function(req, res) {
    res.send('testing home route');
});

app.get('/movie', function(req, res) {
    request.get('http://www.omdbapi.com/?t=the+big+lebowski', function(error, response, body) {
        res.send(body);
    });
});

app.get('/movie/:moviename', function(req, res) {
    var url = 'http://www.omdbapi.com/?t=' + req.params.moviename;
    request.get(url, function(error, response, body) {
        res.send(body);
    });
});

app.post('/movies', function(req, res) {
    var movieStr = req.body.moviename.replace(' ', '+');
    var url = 'http://www.omdbapi.com/?t=' + movieStr;
    request.get(url, function(error, response, body) {
        var jsonBody = JSON.parse(body);
        res.send(jsonBody.imdbRating);
    });
});

app.listen(8080, function() {
    console.log('Express app listening on port 8080');
});
