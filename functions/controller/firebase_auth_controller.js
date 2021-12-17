var Pages = require('../model/constants.js').pages; 
const FirebaseAuth = require("firebase/auth");
var FirebaseAdmin = require('firebase-admin');


async function sessionLogin(req, res){

    //Get idToken from our session login fetch request
    const idToken = req.body.idToken.toString();

    //Set the cookie session expiration s * m * h * d * ms = 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    //Create a session cookie from the user's unique Id Token
    FirebaseAdmin
    .auth()
    .createSessionCookie(idToken, {expiresIn})
    .then(
        (sessionCookie)=>{
            //Set the cookie options
            const options = {maxAge: expiresIn, httpOnly: true};

            //The response will send the cookie "__session" as a response 
            res.cookie("__session", sessionCookie, options);
            return res.end();        
        },
        (error) => {
            console.log("SESSION LOGIN FAILED!!!");
            res.status(401).send("UNAUTHORIZED ACCESS")
        }
    );
    
}



async function verifySession(sessionCookie){
    let user = null;
    console.log("The session cookie is:");
    console.log(sessionCookie);
    await FirebaseAdmin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims)=>{
        console.log(`DECODED CLAIMS: ${JSON.stringify(decodedClaims)}`);
        user = decodedClaims;
    })
    .catch((e)=>{
        console.log(`The error is ${e}`);
    });

    return user
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
            return res.render(Pages.REGISTER_PAGE, {alertMessage: errorMessage, successMessage: null, user: req.user, csrfToken: req.csrfToken()});
        } else {
            await FirebaseAdmin.auth().createUser({
                email,
                password,
            });
            return res.render(Pages.LOGIN_PAGE, {alertMessage: "Registration Successful! Please Log In", user: req.user, csrfToken: req.csrfToken()});
        }

    } catch (e) {
        res.setHeader('Cache-Control', 'private');
        return res.render(Pages.REGISTER_PAGE, {alertMessage: `${e}`, user: req.user, csrfToken: req.csrfToken()});
    }

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
        res.setHeader('Cache-Control', 'private');
        return res.render(Pages.LOGIN_PAGE, {alertMessage: "Password Reset Link Sent!", csrfToken: req.csrfToken()});
    }).catch(e => {
        res.setHeader('Cache-Control', 'private');
        return res.render(Pages.FORGOT_PASSWORD_PAGE, {alertMessage: `${e}`, csrfToken: req.csrfToken()});
    });
}


async function logoutUser(req, res){
    res.clearCookie("__session");
    return res.redirect('/login');
}

async function verifyIdToken(idToken)
{
    try {
        const decodedIdToken = await FirebaseAdmin.auth().verifyIdToken(idToken);
        console.log(decodedIdToken);
        return decodedIdToken;
    } catch(e) {
        console.log(e);
        return null;
    }
}


module.exports = {
    sessionLogin,
    generateToken,
    registerUser,
    sendPasswordResetLink,
    logoutUser,
    verifyIdToken,
    verifySession,
}