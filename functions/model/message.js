var Args = require('./constants.js').firebase_args;

class Message{

    constructor(){
        this.smilMessage = "";
        this.composer = "";
        this.recepient = "";
        this.timeStamp = "";
        this.textMessage = "";
        this.textDuration = "";
        this.subject = "";
    }


    setSubject(subject){
        this.subject = subject;
    }

    setTimeStamp(time){
        this.timeStamp = time;
    }

    setComposer(composer){
        this.composer = composer;
    }

    setRecepient(recepient){
        this.recepient = recepient;
    }

    setTextMessage(textMessage, textDuration){
        this.textMessage = textMessage;
        this.textDuration = textDuration;
    }

    constructSmilMessage(){
        /* Construct Smil message based off of textMessage and textDuration */
        let smilMessage = `
            <par>
                <text val="${this.textMessage}" dur="${this.textDuration}">
            </par>
        `        
        this.smilMessage = smilMessage;
    }

    serialize(){

        return {
            "time_stamp": this.timeStamp,
            "composer": this.composer,
            "recepient": this.recepient,
            "text_message": this.textMessage,
            "text_duration": this.textDuration,
            "smil_message": this.smilMessage,
            "subject": this.subject,
        }
    }


    static deserialize(message){
        var deserializedMessage = new Message();
        deserializedMessage.setTimeStamp(message[Args.TIME_STAMP]);
        deserializedMessage.setComposer(message[Args.COMPOSER]);
        deserializedMessage.setRecepient(message[Args.RECEPIENT]);
        deserializedMessage.setTextMessage(message[Args.TEXT_MESSAGE], message[Args.TEXT_DURATION]);
        deserializedMessage.setSubject(message[Args.SUBJECT]);
        deserializedMessage.constructSmilMessage();
        return deserializedMessage;
    }
}


module.exports = Message;