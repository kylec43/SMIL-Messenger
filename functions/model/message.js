var Args = require('./constants.js').firebase_args;

class Message{

    constructor(){
        this.smilMessage = "";
        this.composer = "";
        this.recepient = "";
        this.timeStamp = "";
        this.subject = "";
        this.state = "";
        this.elements = "";
        this.id = "";
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

    setElements(elements){
        // console.log(elements)
        this.elements = elements;
    }

    setState(state){
        this.state = state;
    }

    setSmilMessage(message){
        this.smilMessage = message;
    }

    setId(id){
        this.id = id;
    }

    serialize(){
        return {
            "time_stamp": this.timeStamp,
            "composer": this.composer,
            "recepient": this.recepient,
            "elements": this.elements,
            "smil_message": this.smilMessage,
            "subject": this.subject,
            "state": this.state,
        }
    }

    getTimestampString(){
        let date = new Date(this.timeStamp.seconds*1000);
        date.setHours(date.getHours() - 6);
        return date.toDateString() + " " + date.toLocaleTimeString('en-US');
    }

    static deserialize(message, id){
        var deserializedMessage = new Message();
        deserializedMessage.setTimeStamp(message[Args.TIME_STAMP]);
        deserializedMessage.setComposer(message[Args.COMPOSER]);
        deserializedMessage.setRecepient(message[Args.RECEPIENT]);
        deserializedMessage.setElements(message[Args.ELEMENTS]);
        deserializedMessage.setSubject(message[Args.SUBJECT]);
        deserializedMessage.setState(message[Args.STATE]);
        deserializedMessage.setSmilMessage(message[Args.SMIL_MESSAGE]);
        deserializedMessage.setId(id);
        deserializedMessage.timeStampString = deserializedMessage.getTimestampString();
        return deserializedMessage;
    }
}

module.exports = Message;
