## node-express-request-routes

### Intro

Today we'll be refactoring routes that we've built using node.js, and start using express.js for our routing. [Express.js](http://expressjs.com/) is a node.js web framework that abstracts out parts of node to make life much much simpler, without losing any of the functionality we get with node. It also adds a bunch of HTTP utility methods as well as gives us access to a ton of middleware.

### Middleware

Middleware is any number of functions that are called by Express.js before your final request handler. What that means is that whenever you get a request hitting your server, it first goes through any middleware functions you might have, before it hits the route you've defined. This might be a little confusing, so let's start building an app with express and actually get an example of what's going

### Node server

You've now built a couple of node servers. With vanilla node, you would create a server using '.listen'

```js
var http = require('http');

var server = http.createServer();

server.listen(8080, 'localhost', function() {
    console.log('listening on port 8080');
});
```

This is the simplest way to build a server with node. It's not actually doing anything right now, but we can add in a 'handlerequest' function to deal with any requests coming into that server.

### Express Server

Express makes handling requests simpler. Instead of having a generic function that will have to handle any requests coming into our server, what we can do is define a response to a given route. To start with, create a new project directory, navigate into it in your terminal and run

```sh
$ touch app.js
$ npm init
```

Just hit enter to accept all the defaults. We can now npm install express.

```sh
$ npm install express --save
```

So now, to build the simplest server we can build, let's add the following code into our app.js file.

```js
var express = require('express');
var app = express();

app.listen(8080, function() {
    console.log('Express app listening on port 8080');
});
```

So line by line, what this is doing is requiring in the Express module, then creating a new variable called app and assigning it to 'express()' this line allows us to call all of the express functions on our variable app, which is exactly what we do in the next section. It looks very similiar to the node server, it has just abstracted out the need for the http module, and made things a little more readable. What happens when we run the app?

```sh
$ node app.js
Express app listening on port 8080
```

## Break Point 1

### The first route

Okay, so we now have a server to run, but that's not doing a great deal at the moment. Let's build our first express route and then go through what each part is doing.

```js
var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('testing home route');
});

app.listen(8080, function() {
    console.log('Express app listening on port 8080');
});
```

Here we have our first route. What this route is doing is responding to any GET request to our home route. That's what is defined in the parentheses as '/'. So if we navigate to **localhost:8080/** We should see a string displayed on our page, 'testing home route'. The node app will not return a response until you call res.send or res.render.Every time we hit that route, it will send the same string back. Side note - req is shorthand for request and res is shorthand for response.

### Code Stuff!!!

Write your own route that sends a string back when the user hits a certain URL.

## Break Point 2

### Request

We can now add in a request section that will allow us to make server-side api calls. To add the request module into your application, go to your root project directory in your terminal and type

```sh
$ npm install request --save
```

Then let's require request at the top of our app.js file.

```js
var request = require('request');
```

This will allow us to make server-side api calls. So let's build a new route that when we hit, it will make a call to the omdb movie api. To start with, we'll just find a movie and return it to the user. Let's go with the Big Lebowski.

```js
app.get('/movie', function(req, res) {
    request.get('http://www.omdbapi.com/?t=the+big+lebowski', function(error, response, body) {
        res.send(body);
    });
});
```

Now our route is a little more complicated. What happens here is that when the server recieves a GET request to the endpoint **localhost:8080/movie** our server sends a GET request to the OMDB api. Once that api request has come back to our server, we call res.send to send the data recieved from the external api back down to our end user in json format. To test this out, kill your server if it's still running, restart it, and then point your browser at **localhost:8080/movie**. So what comes back? Also, check what happens with the other routes, are they still returning what you'd expect?

## Break Point 3

### More Dynamic

So there's currently a route built that will return a movie, however, as great a movie as that is, really we want a more dynamic route. So let's look at how we can edit this route to find a movie that we give it. We're going to pass the movie name into our url as a parameter. So how do we process that request on the server side?

```js
app.get('/movie/:moviename', function(req, res) {
    console.log(req.params);
    res.send(req.params)
});
```

We can set up a route with a colon in it. This means that what comes after the colon can change. If we console log this, and then send it to the client side, we can log whatever is being entered after the colon. For example, if we hit the route **localhost:8080/movie/the+big+lebowski** we should see an object displayed on the page, with a key moviename, and a value of the+big+lebowski. Note the the '+' signs indicate spaces in a url. req.params is the parameter request. It's what's being passed into the url.

So with the omdb api we can now dynamically search by a movie name that we pass into our url.

```js
app.get('/movie/:moviename', function(req, res) {
    var url = 'http://www.omdbapi.com/?t=' + req.params.moviename;
    request.get(url, function(error, response, body) {
        res.send(body);
    });
});
```

Here, we are creating our OMDB api url string dynamically by adding whatever the request parameters are to the basic OMDB api endpoint to search for a movie. Try a few different movie names, and each time you should get a JSON object back with that movies information.

## Break Point 4

### Middleware Continued

So far we have only covered GET requests. Passing information through the URL is certainly one way of getting information from the client, to the server side, but we can also use POST requests to do this. a POST request also allows us to send more data if we wanted to. So how do we write a POST request?

```js
app.post('/movies', function(req, res) {
    console.log(req);
    res.send(req.body);
});
```

This is correctly written out, but if we actually hit this endpoint, we aren't returned anything. The problem is that we're missing some middleware. What we need is a way of parsing data before it gets to each request. In this particular instance, we will be using [bodyparser](https://www.npmjs.com/package/body-parser). This populates the request body with the information we have sent it, and then allow us to access that information in our routes. First, install bodyparser using terminal.

```sh
$ npm install --save body-parser
```

Next, require it at the top of the app.js file

```js
var bodyParser = require('body-parser');
```

The next step is a little complicated. In order to use middleware, we use the syntax ```app.use```. This indicates to the application that before hitting any route, call this function first. The function sits between the client request coming in, and the routes we have defined. Hence - middleware.

```js
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
```

Let's also try a simple example of app.use

```js
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});
```

Another note, be careful about the placement of app.use, as it must be called after app is defined. Here is the top of the app.js file, as it should be laid out.

```js
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
```

Looking solely at the third app.use function, each time we hit any endpoint, we should see a console log with time - and the current time. The 'Next()' line indicates that once the middleware function has been fired off, then move onto either the next middleware function or the route itself. Try hitting a route, and check what gets logged in the console.

So you can see that each route will still return the same thing as before, but now every time we hit a route we are also logging something to the console. The middleware acts before the request hits our routes, but it doesn't change what's going on with the routes either. It just does it's thing, then allows the request to continue on its way.


## Break Point 5

### Finishing our POST request

Now we've covered middleware, let's try our POST route again. We'll need to do this using either Postman, or CURL. With curl, the command to send data in a POST request is as follows

```sh
$ curl --data "moviename=zoolander" http://localhost:8080/movies
```

Our console should log

```sh
{"moviename":"zoolander"}%
```

So now we are getting a request body through with a moviename, and we can access that in the route. The next step is to build another request to the OMDB server that will take that movie name and then send down the resulting data back to our client.

### Code stuff!!!

Build out the rest of the POST route. You will need to take the data passed through to the route and send a request to OMDB. How would you deal with a movie with spaces in it? Once you have gotten the data back from OMDB, send the imdbRating back down to the client.

HINT - You may need to use JSON.parse function to access the data you will need...







