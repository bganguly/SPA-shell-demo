/**
 *
 */
"use strict";

/**
 * setup a promise object
 * @param url
 * @param responseTypeExpected
 * @returns {Promise}
 */
function getPromise(url, responseTypeExpected) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = function() {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject("unable to complete xhr");
            }
        };
        request.onerror = function() {
            reject("unable to complete xhr");
        };
        request.send();
    });
}

/**
 * make the xhr call and process response
 */
var createObjFromResponse = function() {
    getPromise('../data.json','json').then(function(response) {
        console.log(JSON.parse(response));
        renderJsonContent(JSON.parse(response));
    }, function(msg) {
        console.error(msg);
    });
};
/**
 * populate divs with json response callback
 */
var renderJsonContent = function(responseArray) {
    var contentEl = document.getElementsByClassName('content')[0];
    var divNode;
    var textNode;
    var imgNode;
    var imgTitleNode;
    var imgFileNode;
    var lineSeparatorNode;
    var divWithDescriptionNode;
    var eachObjInResponse;
    // flush content in preparation for renedering new json data
    contentEl.innerHTML = "";
    for (var idx=0; idx<responseArray.length;idx++) {
        eachObjInResponse = responseArray[idx];

        divNode= document.createElement('div');
        divNode.className = "align-center";

        imgNode= document.createElement('img');
        imgNode['src'] = "images/"+eachObjInResponse['image_name'];
        divNode.appendChild(imgNode);

        imgTitleNode= document.createElement('div');
        imgTitleNode.className = "img-title";
        textNode = document.createTextNode(eachObjInResponse['title']);
        imgTitleNode.appendChild(textNode);
        divNode.appendChild(imgTitleNode);

        imgFileNode= document.createElement('div');
        imgFileNode.className = "img-file";
        textNode = document.createTextNode(eachObjInResponse['image_name']);
        imgFileNode.appendChild(textNode);
        divNode.appendChild(imgFileNode);

        divWithDescriptionNode= document.createElement('div');
        divWithDescriptionNode.className = "img-description";
        textNode = document.createTextNode(eachObjInResponse['description']);
        divWithDescriptionNode.appendChild(textNode);
        divNode.appendChild(divWithDescriptionNode);

        contentEl.appendChild(divNode);
    }

}

/**
 * call the main function
 */
createObjFromResponse();