var FirebaseFirestore = require('firebase/firestore/lite');
var Message = require('../model/message.js');
var Folders = require('../model/constants.js').firebase_folders;
var Args = require('../model/constants.js').firebase_args;
var Pages = require('../model/constants.js').pages;
var FirebaseAdmin = require('firebase-admin');


async function uploadMessage(req, res, state_arg){

    try{
        /* Get user input */
        const recepient = req.body.recepient;
        const subject = req.body.subject;
        const timeStamp = FirebaseFirestore.Timestamp.fromDate(new Date());
        const state = state_arg;
        const elements = req.body.elem

        /* Construct Message object */
        const newMessage = new Message();
        newMessage.setComposer(req.user.email);
        newMessage.setRecepient(recepient);
        newMessage.setTimeStamp(timeStamp);
        newMessage.setElements(elements);
        newMessage.setSubject(subject);
        newMessage.setState(state);
        newMessage.constructSmilMessage(elements);

        /* upload newMessage to doc location*/
        await FirebaseFirestore.addDoc(FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), Folders.MESSAGE_FOLDER), newMessage.serialize());

        return res.render(Pages.COMPOSE_PAGE, {errorMessage: null, user: req.user});
    } catch(e){
        console.log(`upload failed: ${e}`);
        return res.render(Pages.COMPOSE_PAGE, {errorMessage: `${e}`, user: req.user});
    }
}

async function getSentMessages(user){

    const q = FirebaseFirestore.query(
        FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), "messages"), 
        FirebaseFirestore.where(Args.COMPOSER, "==", user.email), 
        FirebaseFirestore.orderBy("time_stamp", "desc")
        );

    querySnapshot = await FirebaseFirestore.getDocs(q);

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