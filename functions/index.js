//initialize firebase admin
var FirebaseAdmin = require('firebase-admin');
var serviceAccount = require("./smil-messenger-firebase-adminsdk-2qumu-2c8573a700.json");
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
  storageBucket: "smil-messenger.appspot.com",
});


// Import the functions you need from the SDKs you need
const firebase = require('firebase/app');

const firebaseConfig = {
  apiKey: "AIzaSyC1VKYnY0Dd6dyqFWb1MpFqPSLaB4vR_os",
  authDomain: "smil-messenger.firebaseapp.com",
  projectId: "smil-messenger",
  storageBucket: "smil-messenger.appspot.com",
  messagingSenderId: "22154390182",
  appId: "1:22154390182:web:aacf18ff9407c7b93d2267",
  measurementId: "G-ZHDXYYLFYC"
};

// Initialize Firebase
const fbApp = firebase.initializeApp(firebaseConfig);



//Set up express with ejs
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './view');

//Let express handle requests
const functions = require("firebase-functions");
exports.httpReq = functions.https.onRequest(app);



/* Import modules */
const Pages = require('./model/constants.js').pages;
const FirebaseAuthController = require('./controller/firebase_auth_controller.js');
const MessageManager = require('./controller/message_manager.js');

app.get('/', authAndRedirectInbox, (req, res) => {
    res.redirect('/login');
});


app.get('/login', authAndRedirectInbox, (req, res) => {
    res.render(Pages.LOGIN_PAGE, {errorMessage: null, successMessage: null});
});


app.post('/login', authAndRedirectInbox, async (req, res) => {
    return await FirebaseAuthController.loginUser(req, res);
});

app.get('/forgot_password', authAndRedirectInbox, (req, res) => {
    res.render(Pages.FORGOT_PASSWORD_PAGE, {errorMessage: null});
});

app.post('/forgot_password', authAndRedirectInbox, async (req, res) => {
    return await FirebaseAuthController.sendPasswordResetLink(req, res);
});


app.get('/register', authAndRedirectInbox, (req, res) => {
    res.render(Pages.REGISTER_PAGE, {errorMessage: null});
});

app.post('/register', authAndRedirectInbox, (req, res) => {
   return FirebaseAuthController.registerUser(req, res);
});


app.get('/compose', authAndRedirectLogin, (req, res) => {
    res.render(Pages.COMPOSE_PAGE, {errorMessage: null, user: req.user});
});

app.post('/compose', authAndRedirectLogin, async (req, res) => {
    return await MessageManager.uploadMessage(req, res, "draft");
});


app.get('/drafts', authAndRedirectLogin, async (req, res) => {
    let drafts = await MessageManager.getDrafts(req.user);
    res.render(Pages.DRAFTS_PAGE, {errorMessage: null, user: req.user, drafts});
});


app.get('/inbox', authAndRedirectLogin, async (req, res) => {
    let inboxMessages = await MessageManager.getInboxMessages(req.user);
    //console.log(`Inbox messages length is ${inboxMessages.length}`);
    res.render(Pages.INBOX_PAGE, {errorMessage: null, user: req.user, inboxMessages});
});


app.get('/sent', authAndRedirectLogin, async (req, res) => {
    let sentMessages = await MessageManager.getSentMessages(req.user);
    console.log(`Sent messages length is ${sentMessages.length}`);
    res.render(Pages.SENT_PAGE, {errorMessage: null, user: req.user, sentMessages});
});


app.get('/mediaplayer', authAndRedirectLogin, (req, res) => {
    res.render(Pages.MEDIAPLAYER_PAGE, {errorMessage: null, user: req.user});
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

