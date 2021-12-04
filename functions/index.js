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

// cb-working =======================================================================

// app.use(express.json());    // <==== parse request body as JSON
// app.use(express.urlencoded({
//   extended: true
// }));

app.get('/compose', authAndRedirectLogin, (req, res) => {
    res.render(Pages.COMPOSE_PAGE, {errorMessage: null, user: req.user});
});

app.post('/compose-send', authAndRedirectLogin, async (req, res) => {
    return await MessageManager.uploadMessage(req, res, "sent");
});

app.post('/compose-draft', authAndRedirectLogin, async (req, res) => {
    console.log("===============");
    for (var i=0; i<req.body.elem.length; i++){
        console.log(req.body.elem[i]['begin']);
        console.log(req.body.elem[i]['dur']);
        console.log(req.body.elem[i]['txt']);
    }
    console.log("===============");

    return res.render(Pages.COMPOSE_PAGE, {errorMessage: null, user: req.user});

    // return await MessageManager.uploadMessage(req, res, "draft");
});


// end-working ===================================================================


app.get('/drafts', authAndRedirectLogin, (req, res) => {
    res.render(Pages.DRAFTS_PAGE, {errorMessage: null, user: req.user});
});


app.get('/inbox', authAndRedirectLogin, (req, res) => {
    res.render(Pages.INBOX_PAGE, {errorMessage: null, user: req.user});
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

// cb-test
const FirebaseAuth = require("firebase/auth");

async function authAndRedirectLogin(req, res, next){
    
    // cb-test
    await FirebaseAuth.signInWithEmailAndPassword(FirebaseAuth.getAuth(), "cbeardain@uco.edu", "chad9999");

    req.user = FirebaseAuthController.getCurrentUser();
    
    if(req.user){
        req.token = await FirebaseAuthController.generateToken(req.user);
        return next();
    } else {
        res.redirect('/login');
    }
}


async function authAndRedirectInbox(req, res, next){

    // cb-test
    await FirebaseAuth.signInWithEmailAndPassword(FirebaseAuth.getAuth(), "cbeardain@uco.edu", "chad9999");

    req.user = FirebaseAuthController.getCurrentUser();
    
    if(req.user){
        res.redirect('/inbox');
    } else {
        return next();
    }
}
