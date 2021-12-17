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


//set function as API endpoint for express
const functions = require("firebase-functions");
exports.httpReq = functions.https.onRequest(app);


/* Import modules */
const Pages = require('./model/constants.js').pages;
const FirebaseAuthController = require('./controller/firebase_auth_controller.js');
const MessageManager = require('./controller/message_manager.js');


/* Setup csurf, cookieParser */
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const csrfMiddleWare = csrf({cookie: true});
app.use(cookieParser());
app.use(csrfMiddleWare);

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    console.log("=========================CSERF===========================");
    res.setHeader('Cache-Control', 'private');
    next();
});


app.get('/', authAndRedirectInbox, (req, res) => {
    res.redirect('/login');
});


app.get('/login', authAndRedirectInbox, (req, res) => {
    res.render(Pages.LOGIN_PAGE, {alertMessage: null, csrfToken: req.csrfToken()});
});


app.post('/session_login', authAndRedirectInbox, async (req, res) => {
    return await FirebaseAuthController.sessionLogin(req, res);
});

app.get('/forgot_password', authAndRedirectInbox, (req, res) => {
    res.render(Pages.FORGOT_PASSWORD_PAGE, {alertMessage: null, csrfToken: req.csrfToken()});
});

app.post('/forgot_password', authAndRedirectInbox, async (req, res) => {
    return await FirebaseAuthController.sendPasswordResetLink(req, res);
});


app.get('/register', authAndRedirectInbox, (req, res) => {
    res.render(Pages.REGISTER_PAGE, {alertMessage: null, csrfToken: req.csrfToken()});
});

app.post('/register', authAndRedirectInbox, (req, res) => {
   return FirebaseAuthController.registerUser(req, res);
});


app.get('/compose', authAndRedirectLogin, (req, res) => {
    res.render(Pages.COMPOSE_PAGE, {alertMessage: null, user: req.user, draft: null, csrfToken: req.csrfToken()});
});

app.post('/compose-send', authAndRedirectLogin, async (req, res) => {
    return await MessageManager.uploadMessage(req, res, "sent");
});

app.post('/compose-draft', authAndRedirectLogin, async (req, res) => {
    // console.log("==========COMPOSE+==================DRAFT==========");
    return await MessageManager.uploadMessage(req, res, "draft");
});


app.post("/edit-draft", authAndRedirectLogin, (req, res) => {

    var messageString = req.body.draft;
    var messageObject = JSON.parse(messageString);
    // console.log(messageObject);
    // console.log(messageObject.recepient);
    return res.render(Pages.COMPOSE_PAGE, {alertMessage: null, user: req.user, draft: messageObject, csrfToken: req.csrfToken()});
});

app.get('/drafts', authAndRedirectLogin, async (req, res) => {
    let drafts = await MessageManager.getDrafts(req.user);
    res.render(Pages.DRAFTS_PAGE, {alertMessage: null, user: req.user, drafts, csrfToken: req.csrfToken()});
});


app.get('/inbox', authAndRedirectLogin, async (req, res) => {
    let inboxMessages = await MessageManager.getInboxMessages(req.user);
    //console.log(`Inbox messages length is ${inboxMessages.length}`);
    res.render(Pages.INBOX_PAGE, {alertMessage: null, user: req.user, inboxMessages, csrfToken: req.csrfToken()});
});


app.get('/sent', authAndRedirectLogin, async (req, res) => {
    let sentMessages = await MessageManager.getSentMessages(req.user);
    // console.log(`Sent messages length is ${sentMessages.length}`);
    res.render(Pages.SENT_PAGE, {alertMessage: null, user: req.user, sentMessages, csrfToken: req.csrfToken()});
});


app.get('/mediaplayer', authAndRedirectLogin, (req, res) => {
    res.render(Pages.MEDIAPLAYER_PAGE, {alertMessage: null, user: req.user, csrfToken: req.csrfToken()});
});

app.get('/logout', async (req, res) => {
    return await FirebaseAuthController.logoutUser(req, res);
})


async function authAndRedirectLogin(req, res, next){
    const sessionCookie = req.cookies.__session || "";
    req.user = await FirebaseAuthController.verifySession(sessionCookie);
    
    if(req.user){
        req.token = await FirebaseAuthController.generateToken(req.user);
        return next();
    } else {
        res.redirect('/login');
    }
}


async function authAndRedirectInbox(req, res, next){
    const sessionCookie = req.cookies.__session || "";
    req.user = await FirebaseAuthController.verifySession(sessionCookie);
    
    if(req.user){
        res.redirect('/inbox');
    } else {
        return next();
    }
}
