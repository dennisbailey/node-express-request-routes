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

app.get('/', function(request, response) {
    response.send('testing home route');
});

app.listen(8080, function() {
    console.log('Express app listening on port 8080');
});
```

Here we have our first route. What this route is doing is responding to any GET request to our home route. That's what is defined in the parentheses as '/'. So if we navigate to **localhost:8080/** We should see a string displayed on our page, 'testing home route'. Every time we hit that route, it will send the same string back. Side note - request and response are often written shorthand as 'req' and 'res'.

### Code Stuff!!!

Write your own route that sends a string back when the user hits a certain URL.

## Break Point 2


