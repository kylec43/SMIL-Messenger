const Pages = require('./model/constants.js').pages;

//Set up express with ejs
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './view');

//Let express handle requests
const functions = require("firebase-functions");
exports.httpReq = functions.https.onRequest(app);


app.get('/', (req, res) => {
    res.render(Pages.LOGIN_PAGE, {message: "This is a message"});
});


app.get('/forgot_password', (req, res) => {
    res.render(Pages.FORGOT_PASSWORD_PAGE, {message: "This is a message"});
});


app.get('/register', (req, res) => {
    res.render(Pages.REGISTER_PAGE, {message: "This is a message"});
});


app.get('/compose', (req, res) => {
    res.render(Pages.COMPOSE_PAGE, {message: "This is a message"});
});


app.get('/drafts', (req, res) => {
    res.render(Pages.DRAFTS_PAGE, {message: "This is a message"});
});


app.get('/inbox', (req, res) => {
    res.render(Pages.INBOX_PAGE, {message: "This is a message"});
});


app.get('/sent', (req, res) => {
    res.render(Pages.SENT_PAGE, {message: "This is a message"});
});


app.get('/mediaplayer', (req, res) => {
    res.render(Pages.MEDIAPLAYER_PAGE, {message: "This is a message"});
});

