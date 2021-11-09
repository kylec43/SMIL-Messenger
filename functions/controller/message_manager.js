var FirebaseFirestore = require('firebase/firestore/lite');
var Message = require('../model/message.js');
var Folders = require('../model/constants.js').firebase_folders;
var Args = require('../model/constants.js').firebase_args;
var Pages = require('../model/constants.js').pages;
var FirebaseAdmin = require('firebase-admin');

async function uploadMessage(req, res){

    try{

        /* Get user input */
        const recepient = req.body.recepient;
        const message = req.body.message;
        const duration = req.body.duration;
        const timeStamp = FirebaseFirestore.Timestamp.fromDate(new Date());

        /* Create smil message from message and duration */
        let smilMessage = `
            <par>
                <text val="${message}" dur="${duration}">
            </par>
        `

        console.log("0")
        /* Construct Message object */
        const newMessage = new Message();
        newMessage.setComposer(req.user.email);
        newMessage.setRecepient(recepient);
        newMessage.setTimeStamp(timeStamp);
        newMessage.setSmilMessage(smilMessage);


        /* upload newMessage to doc location*/
        await FirebaseFirestore.addDoc(FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), Folders.MESSAGE_FOLDER), newMessage.serialize());

        return res.render(Pages.COMPOSE_PAGE, {errorMessage: null, user: req.user});
    } catch(e){
        console.log(`upload failed: ${e}`);
        return res.render(Pages.COMPOSE_PAGE, {errorMessage: `${e}`, user: req.user});
    }
}



async function getSentMessages(user){

    console.log("1")
    const q = FirebaseFirestore.query(
        FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), "messages"), 
        FirebaseFirestore.where(Args.COMPOSER, "==", user.email), 
        FirebaseFirestore.orderBy("time_stamp", "desc")
        );

    console.log("2")
    querySnapshot = await FirebaseFirestore.getDocs(q);


    console.log("3")
    var messages = [];
    querySnapshot.forEach((doc) => {
        let message = Message.deserialize(doc.data());
        messages.push(message);
      });

    return messages;
}


module.exports = {
    uploadMessage,
    getSentMessages,
}