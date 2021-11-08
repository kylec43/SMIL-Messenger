const Pages = require('./model/constants.js').pages;
const FirebaseAuthController = require('./controller/firebase_auth_controller.js');

//Set up express with ejs
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './view');

//Let express handle requests
const functions = require("firebase-functions");
exports.httpReq = functions.https.onRequest(app);


app.get('/', authAndRedirectInbox, (req, res) => {
    res.redirect('/login');
});


app.get('/login', authAndRedirectInbox, (req, res) => {
    res.render(Pages.LOGIN_PAGE, {message: "This is a message", errorMessage: null, successMessage: null});
});


app.post('/login', authAndRedirectInbox, async (req, res) => {
    return await FirebaseAuthController.loginUser(req, res);
});

app.get('/forgot_password', authAndRedirectInbox, (req, res) => {
    res.render(Pages.FORGOT_PASSWORD_PAGE, {message: "This is a message", errorMessage: null});
});

app.post('/forgot_password', authAndRedirectInbox, async (req, res) => {
    return await FirebaseAuthController.sendPasswordResetLink(req, res);
});


app.get('/register', authAndRedirectInbox, (req, res) => {
    res.render(Pages.REGISTER_PAGE, {message: "This is a message", errorMessage: null});
});

app.post('/register', authAndRedirectInbox, (req, res) => {
    return FirebaseAuthController.registerUser(req, res);
});


app.get('/compose', authAndRedirectLogin, (req, res) => {
    res.render(Pages.COMPOSE_PAGE, {message: "This is a message", errorMessage: null, user: req.user});
});


app.get('/drafts', authAndRedirectLogin, (req, res) => {
    res.render(Pages.DRAFTS_PAGE, {message: "This is a message", errorMessage: null, user: req.user});
});


app.get('/inbox', authAndRedirectLogin, (req, res) => {
    res.render(Pages.INBOX_PAGE, {message: "This is a message", errorMessage: null, user: req.user});
});


app.get('/sent', authAndRedirectLogin, (req, res) => {
    res.render(Pages.SENT_PAGE, {message: "This is a message", errorMessage: null, user: req.user});
});


app.get('/mediaplayer', authAndRedirectLogin, (req, res) => {
    res.render(Pages.MEDIAPLAYER_PAGE, {message: "This is a message", errorMessage: null, user: req.user});
});

app.get('/logout', async (req, res) => {
    return await FirebaseAuthController.logoutUser(req, res);
})


/* Middleware */

async function authAndRedirectLogin(req, res, next){
        
    req.user = FirebaseAuthController.getCurrentUser();
    
    if(req.user){
        req.token = await FirebaseAuthController.generateToken(req.user);
        return next();
    } else {
        res.redirect('/login');
    }
}


async function authAndRedirectInbox(req, res, next){
        
    req.user = FirebaseAuthController.getCurrentUser();
    
    if(req.user){
        res.redirect('/inbox');
    } else {
        return next();
    }
}

