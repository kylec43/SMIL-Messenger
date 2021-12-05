window.buildSmilMessage = function(){


    var domBuilder = new DOMParser();
    let template = 
    `
<smil>
    <head>
    </head>
    <body>
    </body>
</smil>
    `;

    console.log("Getting doc");
    var xmlDoc = domBuilder.parseFromString(template, "text/xml");

    let bodyTag = xmlDoc.getElementsByTagName("body")[0];

    let parElements = {};

    console.log("Iterating elements");
    for(let i = 0; true; i++){
        console.log(`Element Count ${i+1}`);
        let elementText = document.getElementsByName(`elem[${i}][txt]`)[0];
        let elementBegin = document.getElementsByName(`elem[${i}][begin]`)[0];
        let elementDuration = document.getElementsByName(`elem[${i}][dur]`)[0];
        
        if(!elementText){
            console.log("text is null");
        }
        if(!elementBegin){
            console.log("begin is null");
        }
        if(!elementDuration){
            console.log("duration is null");
        }
        if(!elementText || !elementBegin || !elementDuration){
            console.log("A value is null");
            break;
        } else {
            console.log("values are not null");
            if(parElements[elementBegin.value]){
                console.log("Adding to existing par");
                parElements[elementBegin.value].push({
                    begin: elementBegin.value,
                    duration: elementDuration.value,
                    text: elementText.value
                });
                console.log(parElements[elementBegin.value]);
            } else {
                console.log("Creating new par");
                parElements[elementBegin.value] = [];
                parElements[elementBegin.value].push({
                    begin: elementBegin.value,
                    duration: elementDuration.value,
                    text: elementText.value 
                });
            }
        }

    }


    for(const key in parElements){
        let parNode = xmlDoc.createElement("par");
        for(let i = 0; i < parElements[key].length; i++){
            let smilTextNode = xmlDoc.createElement("smilText");
            if(i === 0){
                smilTextNode.setAttribute("begin", `${parElements[key][i].begin}s`);
            }
            smilTextNode.setAttribute("dur", `${parElements[key][i].duration}s`);
            smilTextNode.innerHTML = parElements[key][i].text;
            parNode.appendChild(smilTextNode);
        }
        bodyTag.appendChild(parNode);
    }


    /*Get XML String */
    let xmlSerializer = new XMLSerializer();
    let xmlString = xmlSerializer.serializeToString(xmlDoc);    
    console.log(xmlString);

    document.getElementById('smil_text').value = xmlString;
}