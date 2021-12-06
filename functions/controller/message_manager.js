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
        const elements = req.body.elem;
        const smilMessage = req.body.smil_text;
        const draft = JSON.parse(req.body.draft);
        let alertMessage = "";

        if(state_arg === "sent"){
            alertMessage = "Message has been sent!";
        } else {
            alertMessage = "Draft has been saved!";
        }

        if(draft !== null){
            await deleteMessage(draft.id);
            if(state_arg === "draft"){
                alertMessage = "Draft has been updated!";
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
        await FirebaseFirestore.addDoc(FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), Folders.MESSAGE_FOLDER), newMessage.serialize());

        console.log("END============================================");
        return res.render(Pages.COMPOSE_PAGE, {alertMessage, user: req.user, draft: null});
    } catch(e){
        console.log(`upload failed: ${e}`);
        return res.render(Pages.COMPOSE_PAGE, {alertMessage: `${e}`, user: req.user, draft: null});
    }
}

async function deleteMessage(id){
    const docRef = FirebaseFirestore.doc(FirebaseFirestore.getFirestore(), 'messages', id);
    await FirebaseFirestore.deleteDoc(docRef);
}

async function getSentMessages(user){

    const q = FirebaseFirestore.query(
        FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), "messages"), 
        FirebaseFirestore.where(Args.COMPOSER, "==", user.email),
        FirebaseFirestore.where("state", "==", "sent"),
        FirebaseFirestore.orderBy("time_stamp", "desc")
        );

    querySnapshot = await FirebaseFirestore.getDocs(q);

    var messages = [];
    querySnapshot.forEach((doc) => {
        console.log(`THE ID is ${doc.id}====================================`);
        let message = Message.deserialize(doc.data(), doc.id);
        messages.push(message);
      });

    return messages;
}



async function getInboxMessages(user){

    try{
    console.log("1");
    console.log(Args.RECEPIENT);
    const q = FirebaseFirestore.query(
        FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), "messages"), 
        FirebaseFirestore.where("recepient", "==", user.email),
        FirebaseFirestore.where("state", "==", "sent"),
        FirebaseFirestore.orderBy("time_stamp", "desc")
        );

    console.log("2");
    querySnapshot = await FirebaseFirestore.getDocs(q);


    console.log("3");
    var messages = [];
    querySnapshot.forEach((doc) => {
        console.log(`THE ID is ${doc.id}====================================`);
        let message = Message.deserialize(doc.data(), doc.id);
        
        messages.push(message);
      });
    } catch(e){
        console.log(e);
    }

    return messages;
}



async function getDrafts(user){

    try{
    console.log("1");
    console.log(Args.RECEPIENT);
    const q = FirebaseFirestore.query(
        FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), "messages"), 
        FirebaseFirestore.where(Args.COMPOSER, "==", user.email),
        FirebaseFirestore.where("state", "==", "draft"),
        FirebaseFirestore.orderBy("time_stamp", "desc")
        );

    console.log("2");
    querySnapshot = await FirebaseFirestore.getDocs(q);


    console.log("3");
    var messages = [];
    querySnapshot.forEach((doc) => {
        console.log(`THE ID is ${doc.id}====================================`);
        let message = Message.deserialize(doc.data(), doc.id);
        messages.push(message);
      });
    } catch(e){
        console.log(e);
    }

    return messages;
}


module.exports = {
    uploadMessage,
    getSentMessages,
    getInboxMessages,
    getDrafts,
}