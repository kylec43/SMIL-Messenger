var Pages = require('../model/constants.js').pages; 
const FirebaseAuth = require("firebase/auth");
var FirebaseAdmin = require('firebase-admin');


async function loginUser(req, res){

    let email = req.body.user_email;
    let password = req.body.user_password;

    await FirebaseAuth.signInWithEmailAndPassword(FirebaseAuth.getAuth(), email, password)
    .then((userCredential) => {
        return res.redirect('/inbox');
    })
    .catch((e) => {
        console.log(`Error: ${e}`)
        return res.render(Pages.LOGIN_PAGE, {alertMessage: `${e}`});
    });
    
}


async function registerUser(req, res) 
{
    
    const email = req.body.user_email;
    const confirmEmail = req.body.user_confirm_email;
    const password = req.body.user_password;
    const confirmPassword = req.body.user_confirm_password;

    let errorMessage = "";

    try {
        if(email !== confirmEmail){
            error = true;
            errorMessage += "Email and Confirmation Email do not match";
        }
        if(password !== confirmPassword){
            errorMessage += errorMessage.length > 0 ? "<br>" : "";
            errorMessage += "Password and Confirmation Password do not match"
        } else if(password.length < 6){
            errorMessage += errorMessage.length > 0 ? "<br>" : "";
            errorMessage += "Password length is too short(6 characters min.)"
        }

        if(errorMessage.length > 0){
            return res.render(Pages.REGISTER_PAGE, {alertMessage: errorMessage, successMessage: null, user: req.user});
        } else {
            await FirebaseAuth.createUserWithEmailAndPassword(FirebaseAuth.getAuth(), email, password);
            console.log(getCurrentUser() ? "true" : "false");
            return res.render(Pages.LOGIN_PAGE, {alertMessage: "Registration Successful! Please Log In", user: req.user});
        }

    } catch (e) {
        return res.render(Pages.REGISTER_PAGE, {alertMessage: `${e}`, user: req.user});
    }

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


async function sendPasswordResetLink(req, res) 
{
    const email = req.body.user_email;
    await FirebaseAuth.sendPasswordResetEmail(FirebaseAuth.getAuth(), email).then(()=>{
        return res.render(Pages.LOGIN_PAGE, {alertMessage: "Password Reset Link Sent!"});
    }).catch(e => {
        return res.render(Pages.FORGOT_PASSWORD_PAGE, {alertMessage: `${e}`});
    });
}


async function logoutUser(req, res){

    await FirebaseAuth.getAuth().signOut()
    .then(() => {
        return res.redirect('/login');
    })
    .catch((e) => {
        return res.render(Pages.LOGIN_PAGE, {alertMessage: `${e}`});
    });
}


module.exports = {
    loginUser,
    getCurrentUser,
    generateToken,
    registerUser,
    sendPasswordResetLink,
    logoutUser,
}