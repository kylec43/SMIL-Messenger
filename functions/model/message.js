var Args = require('./constants.js').firebase_args;

class Message{

    constructor(){
        this.smilMessage = "";
        this.composer = "";
        this.recepient = "";
        this.timeStamp = "";
        this.textMessage = "";
        this.textDuration = "";
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
                <text val="${message}" dur="${duration}">
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
            "smil_message": this.smilMessage
        }
    }


    static deserialize(message){
        var deserializedMessage = new Message();
        deserializedMessage.setTimeStamp(message[Args.TIME_STAMP]);
        deserializedMessage.setComposer(message[Args.COMPOSER]);
        deserializedMessage.setRecepient(message[Args.RECEPIENT]);
        deserializedMessage.setSmilMessage(message[Args.SMIL_MESSAGE]);
        return deserializedMessage;
    }
}


module.exports = Message;