
var express = require('express');
var app = express();
var socket = require('socket.io');

var server = app.listen(5000, function (){
    console.log('Listening on port 5000');
});
app.use(express.static('public'));

var io = socket(server);


//letting us know that the connection to the socket was complete and gives us the socket identification
io.on('connection', function(socket){
    console.log('made socket connection',socket.id)

});

//socket.io connecting and emitting all messages to all opened clients
io.on('connection', function(socket) {
    socket.on('message', (message) => {
        socket.broadcast.emit('message', message)
        console.log('connection complete')
    })
})

require('dotenv').config()
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require('body-parser');

var socket = require('socket.io');

//for login/logout (authentication)
var bcrypt = require('bcryptjs'); // encrypt password and to check passwords
var jwt = require('jsonwebtoken');


// set the app up with bodyparser
app.use(bodyParser());

// Database configuration
var databaseUrl = 'mongodb://localhost:27017/live-stream_db';
var collections = ["live-stream_db"];


// //letting us know that the connection to the socket was complete and gives us the socket identification
// io.on('connection', function(socket){
//     console.log('made socket connection',socket.id)

// });
// //socket.io connecting and emitting all messages to all opened clients
// io.on('connection', function(socket) {
//     socket.on('message', (message) => {
//         socket.broadcast.emit('message', message)
//         console.log('connection complete')
//     })
// })


// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function (error) {
    console.log("Database Error:", error);
});

//this loads the .env file in
//we need this for secret information that we don't want on our github
// *we need to delete sample.env before uploaded


console.log('----------hi-----------');
console.log(process.env.JWT_SECRET);
console.log('----------hi-----------');

/*
  if we don't do this here then we'll get this error in apps that use this api

  Fetch API cannot load No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

  read up on CORs here: https://www.maxcdn.com/one/visual-glossary/cors/
*/
//allow the api to be accessed by other apps
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

function verifyToken(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // to check if any req. is using and it will use it


    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decod) => {
            if (err) {
                res.status(403).json({
                    message: "Wrong Token"
                });
            } else {
                req.decoded = decod;
                console.log('req.decoded', req.decoded);
                next();
            }
        });
    } else {
        res.status(403).json({
            message: "No Token"
        });
    }
}

app.get('/', function (req, res) {
    res.send('routes available: login : post -> /login, signup : post -> /signup, get all the pets: get -> /pets, get one pet: get -> /pets/:id, update a pet: post -> /pets/update/:id, deleting a pet: post -> /pets/:id, creating a pet: post -> /pets');
});

//curl -d "username=fred&password=unodostresgreenbaypackers" -X POST http://localhost:3001/login
/*
	this will return

	{"message":"successfuly authenticated","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmM1OTZjOGUxOTZmYmIwZTdkNWI0MGYiLCJ1c2VybmFtZSI6ImZyZWQiLCJpYXQiOjE1Mzk2NzU4OTIsImV4cCI6MTUzOTY5MDI5Mn0.xalv4I9rSmKf9LV6QaeJboV4NvY0F7wIltDMc-o_amQ"}
*/
app.post('/login', function (req, res) {
    db.users.findOne({
        username: req.body.username
    }, function (error, result) {
        if (!result) return res.status(404).json({ error: 'user not found' });
        if (!req.body.password) return res.status(401).json({ error: 'you need a password' });

        // compare the passwords that live the database and passwords that user send to us 
        if (!bcrypt.compareSync(req.body.password, result.password)) return res.status(401).json({ error: 'incorrect password ' });

        // save database infomation and load to front end page
        var payload = {
            _id: result._id,
            username: result.username,
            // firstname, lastname, phone nummber, email

        };
        // create a new token with bcrypt user's data and send to object
        var token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

        return res.json({
            message: 'successfuly authenticated',
            token: token
        });
    });
})


// signup part
//curl -d "username=fred&password=unodostresgreenbaypackers" -X POST http://localhost:3001/signup
app.post('/signup', function (req, res) {
    db.users.findOne({
        username: req.body.username
    }, function (error, result) {
        if (result) return res.status(406).json({ error: 'user already exists' });

        if (!req.body.password) return res.status(401).json({ error: 'you need a password' });

        if (req.body.password.length <= 5) return res.status(401).json({ error: 'password length must be greater than 5' });

        console.log('got to line 92')

        // genSalt creates a random string (hash)
        // 10 represents how many times the string runs through the genSalt function
        bcrypt.genSalt(10, function (err, salt) {

            //hast is the encrypeted password user uses to sign in  
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                db.users.insert({
                    // firstname: req.body.firstname,
                    // lastname: req.body.lastname,
                    username: req.body.username,
                    password: hash
                }, function (error, user) {

                    console.log('got to line 101');

                    // Log any errors
                    if (error) {
                        res.send(error);
                    } else {
                        res.json({
                            message: 'successfully signed up'
                        });
                    }
                });
            });
        });
    });
})

