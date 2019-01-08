"use strict";

const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const http = require('http').Server(app);
const io = require('socket.io')(http,{serveClient:true});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());

const passport = require('passport');
const {Strategy} = require('passport-jwt');

const {jwt} = require("./config");
passport.use(new Strategy(jwt, function (jwt_payload, done) {
    if(jwt_payload != void(0)) return done(false, jwt_payload);
    done();
}));

mongoose.connect('mongodb://localhost:27017/chat',{ useNewUrlParser: true });
mongoose.Promise = require('bluebird');


nunjucks.configure('./client/views',{
    autoescape: true,
    express: app
});

require('./sockets')(io);

require("./router")(app);

http.listen(3000, '0.0.0.0', () => {
    console.log("Server started on port 3000");
});
