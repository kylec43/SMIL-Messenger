var Pages = require('../model/constants.js').pages; 
const FirebaseAuth = require("firebase/auth");

//initialize firebase admin
var FirebaseAdmin = require('firebase-admin');
var serviceAccount = require("../smil-messenger-firebase-adminsdk-2qumu-2c8573a700.json");
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount)
});

//initialize firebase app
const initializeApp = require("firebase/app").initializeApp;

const firebaseConfig = {
    apiKey: "AIzaSyC1VKYnY0Dd6dyqFWb1MpFqPSLaB4vR_os",
    authDomain: "smil-messenger.firebaseapp.com",
    projectId: "smil-messenger",
    storageBucket: "smil-messenger.appspot.com",
    messagingSenderId: "22154390182",
    appId: "1:22154390182:web:aacf18ff9407c7b93d2267",
    measurementId: "G-ZHDXYYLFYC"  
};

const app = initializeApp(firebaseConfig);


async function loginUser(req, res){
    let email = req.body.user_email;
    let password = req.body.user_password;

    await FirebaseAuth.signInWithEmailAndPassword(FirebaseAuth.getAuth(), email, password)
    .then((userCredential) => {
        return res.redirect('/inbox');
    })
    .catch((e) => {
        console.log(`Error: ${e}`)
        return res.render(Pages.LOGIN_PAGE, {error: true, errorMessage: e});
    });
    
}


function getCurrentUser(){
    return FirebaseAuth.getAuth().currentUser;
}


async function generateToken(user){
    let token = null;
    await FirebaseAdmin.auth().createCustomToken(user.uid).then((customToken) => {
                    console.log(`TOKEN CREATED! ${customToken}`);
                    token = customToken;
                })
                .catch((error) => {
                    console.log('Error creating custom token:', error);
                });
    return token;
}


module.exports = {
    loginUser,
    getCurrentUser,
    generateToken,
}