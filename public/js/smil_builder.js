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

    var xmlDoc = domBuilder.parseFromString(template, "text/xml");
    let smilTag = xmlDoc.getElementsByTagName("smil")[0];

    let bodyTag = xmlDoc.getElementsByTagName("body")[0];
    let textNode = xmlDoc.createElement("par");
    bodyTag.appendChild(textNode);

    let xmlSerializer = new XMLSerializer();
    let content = xmlSerializer.serializeToString(xmlDoc);    
    console.log(content);

}