var express = require('express');
var app = express();

app.get('/', function(request, response) {
    res.send('testing home route');
});

app.listen(8080, function() {
    console.log('Express app listening on port 8080');
});
