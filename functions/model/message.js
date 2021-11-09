var Args = require('./constants.js').firebase_args;

class Message{

    constructor(){
        this.smilMessage = "";
        this.composer = "";
        this.recepient = "";
        this.timeStamp = "";
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

    setSmilMessage(smilMessage){
        this.smilMessage = smilMessage;
    }

    serialize(){

        return {
            "time_stamp": this.timeStamp,
            "composer": this.composer,
            "recepient": this.recepient,
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