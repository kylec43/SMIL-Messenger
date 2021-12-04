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
        this.elements = elements;
    }

    setState(state){
        this.state = state;
    }

    constructSmilMessage(elements){
        let smilMessage = `<seq>\n`

        for (var i=0; i<elements.length; i++){
            smilMessage += `
                    <text val="${elements[i]['txt']}" begin="${elements[i]['begin']}"   dur="${elements[i]['dur']}">
        `        
        }
        smilMessage += `</seq>\n`
        this.smilMessage = smilMessage;
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

    static deserialize(message){
        var deserializedMessage = new Message();
        deserializedMessage.setTimeStamp(message[Args.TIME_STAMP]);
        deserializedMessage.setComposer(message[Args.COMPOSER]);
        deserializedMessage.setRecepient(message[Args.RECEPIENT]);
        deserializedMessage.setElements(message[Args.TEXT_MESSAGE]);
        deserializedMessage.setSubject(message[Args.SUBJECT]);
        deserializedMessage.setState(message[Args.STATE]);
        deserializedMessage.constructSmilMessage();
        return deserializedMessage;
    }
}

module.exports = Message;