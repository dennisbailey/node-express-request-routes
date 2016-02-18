var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();


// Middleware
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded ({   // to support URL-encoded bodies
  extended: true
}));

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

app.use('/movies', function (req, res, next) {
  next();
});


// GET Requests
app.get('/', function(req, res) {
    res.send('testing home route');
});

app.get('/secret', function(req, res) {
    res.send('Shhhhhh');
});

app.get('/movie', function(req, res) {
    request.get('http://www.omdbapi.com/?t=the+big+lebowski', function(error, response, body) {
        res.send(body);
    });
});

// app.get('/movie/:moviename', function(req, res) {
//     console.log(req.params);
//     res.send(req.params);
// });

app.get('/movie/:moviename', function(req, res) {
    var url = 'http://www.omdbapi.com/?t=' + req.params.moviename;
    request.get(url, function(error, response, body) {
        res.send(body);
    });
});


// POST Requests
app.post('/movies', function(req, res) {
    var title = req.body.moviename.replace(' ', '+');
    request.get('http://www.omdbapi.com/?t=' + title +'', function(error, response, body) {
        var jsonRes = JSON.parse(body);
        res.send(jsonRes.imdbRating);
    });
});


app.listen(8080, function() {
    console.log('Express app listening on port 8080');
});
