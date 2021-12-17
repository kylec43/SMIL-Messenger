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
        const timeStamp = FirebaseAdmin.firestore.Timestamp.fromDate(new Date());
        const state = state_arg;
        const elements = req.body.elem;
        const smilMessage = req.body.smil_text;
        const draft = JSON.parse(req.body.draft);
        let alertMessage = "";

        if(state_arg === "sent"){
            alertMessage = "Message Sent";
        } else {
            alertMessage = "Draft Saved";
        }

        if(draft !== null){
            await deleteMessage(draft.id);
            if(state_arg === "draft"){
                alertMessage = "Draft Updated";
            }
        }

        /* Construct Message object */
        const newMessage = new Message();
        newMessage.setComposer(req.user.email);
        newMessage.setRecepient(recepient);
        newMessage.setTimeStamp(timeStamp);
        newMessage.setElements(elements);
        newMessage.setSubject(subject);
        newMessage.setState(state);
        newMessage.setSmilMessage(smilMessage);

        /* upload newMessage to doc location*/
        await FirebaseAdmin.firestore().collection(Folders.MESSAGE_FOLDER).add(newMessage.serialize());

        return res.render(Pages.COMPOSE_PAGE, {alertMessage, user: req.user, draft: null, csrfToken: req.csrfToken()});

    } catch(e){
        console.log(`upload failed: ${e}`);
        return res.render(Pages.COMPOSE_PAGE, {alertMessage: `${e}`, user: req.user, draft: null, csrfToken: req.csrfToken()});
    }
}


async function deleteMessage(id){
    await FirebaseAdmin.firestore().doc(`messages/${id}`).delete();
}


async function getSentMessages(user){
    try{
        var querySnapshot = await FirebaseAdmin.firestore().collection("messages")
                            .where(Args.COMPOSER, "==", user.email)
                            .where("state", "==", "sent")
                            .orderBy("time_stamp", "desc")
                            .get();


        var messages = [];
        querySnapshot.forEach((doc) => {
            let message = Message.deserialize(doc.data(), doc.id);
            messages.push(message);
        });

        return messages;

    } catch(e){
        console.log(`${e}`);
    }

}


async function getInboxMessages(user){
    try{

        var querySnapshot = await FirebaseAdmin.firestore().collection("messages")
                            .where("recepient", "==", user.email)
                            .where("state", "==", "sent")
                            .orderBy("time_stamp", "desc")
                            .get();

        console.log(Args.RECEPIENT);


        var messages = [];
        querySnapshot.forEach((doc) => {
            let message = Message.deserialize(doc.data(), doc.id);
            messages.push(message);
        });

        return messages;
    } catch(e){
        console.log(e);
    }

}


async function getDrafts(user){
    try{

        var querySnapshot = await FirebaseAdmin.firestore().collection("messages")
                            .where(Args.COMPOSER, "==", user.email)
                            .where("state", "==", "draft")
                            .orderBy("time_stamp", "desc")
                            .get();

    var messages = [];
    querySnapshot.forEach((doc) => {
        let message = Message.deserialize(doc.data(), doc.id);
        messages.push(message);
      });

      return messages;
    } catch(e){
        console.log(e);
    }

}


module.exports = {
    uploadMessage,
    getSentMessages,
    getInboxMessages,
    getDrafts,
}