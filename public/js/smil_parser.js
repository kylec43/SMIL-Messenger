class SmilParser{
    constructor(smilString){
        this.smilString = smilString;
    }

    getParElements(){
        var parElements = [];

       console.log(`Parsing String: ${this.smilString}`)

        var parser = new DOMParser()
        var xmlDoc = parser.parseFromString(this.smilString, "text/xml");
        console.log(xmlDoc);

        var smilTag = xmlDoc.getElementsByTagName("smil")[0];
        var bodyTag = smilTag.getElementsByTagName("body")[0];
        var parTags = bodyTag.getElementsByTagName("par");
        console.log(`parTags length is ${parTags.length}`);
        for(let i = 0; i < parTags.length; i++){
            let parTag = parTags[i];
            console.log(`parTag index is ${i}`);
            var smilTextTags = parTag.getElementsByTagName("smilText");
            console.log(`smilTextTags length is ${smilTextTags.length}`);
            let beginTime = 0;
            for(let j = 0; j < smilTextTags.length; j++) {
                let textContent = smilTextTags[j].textContent;
                if(j === 0){
                    beginTime = smilTextTags[j].getAttribute("begin");
                    if(!beginTime){
                        beginTime = "0s";
                    }
                }
                let duration = smilTextTags[j].getAttribute("dur");  
                parElements.push({
                    type: 'text',
                    textContent: textContent,
                    beginTime: parseInt(beginTime.slice(0, beginTime.length-1)),
                    duration: parseInt(duration.slice(0, duration.length -1)),
                    id: "smilText" + j.toString() + i.toString(), 
                });
            }
        }

        return parElements;
    }
}