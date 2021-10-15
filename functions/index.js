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

    //res.send("Hello World");
    res.render(Pages.HOME_PAGE, {message: "This is a message"});
});

