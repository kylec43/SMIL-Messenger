
import { getAuth, setPersistence, inMemoryPersistence, signOut, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
//Authentication session will be destroyed after refreshing or changing routes
//Since we are using a session cookie to maintain our session, we do not need any persistance of Firebase Authentication
setPersistence(getAuth(), inMemoryPersistence).then(()=>{
    console.log("Persistance is set");
});

window.sessionLogin = async ()=>{

    //Validate form input
    if(!$("#login_form")[0].checkValidity()){
        $("#login_form")[0].reportValidity(); 
        return;
    }

    let email = $("#user_email").val();
    let password = $("#user_password").val();

    //Login with email in password
    await signInWithEmailAndPassword(getAuth(), email, password).then(async({user})=>{

        //If login is successful, generate an Id token from the logged in user
        return await user.getIdToken().then(async(idToken)=>{

            //Trade this user Id Token for a session cookie from the server
             return await fetch("/session_login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({idToken}),
            });
        });
    }).then(async()=>{
        //Since we now have a session cookie, we no longer need to be signed in or firebase authentication persistance
        return await signOut(getAuth());
    }).then(()=>{
        //Redirect to the inbox page
        window.location.assign("/inbox");
    }).catch((e)=>{
        alert(`${e}`);
    });

}