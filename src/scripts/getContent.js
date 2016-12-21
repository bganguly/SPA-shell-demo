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
var renderDomFromResponse = function() {
    getPromise('../data.json','json').then(function(response) {
        renderJsonContent(JSON.parse(response));
    }, function(msg) {
        console.error(msg);
    });
};

/**
 * returns sorted object by string keys
 * @param objAttribute
 */
var sortObjByAttribute = function(objAttribute){
    return function(objA,objB) {
        var aAttribute = objA[objAttribute].toUpperCase();
        var bAttribute = objB[objAttribute].toUpperCase();
        if (aAttribute < bAttribute) {
            return -1;
        } else if (aAttribute > bAttribute) {
            return 1;
        } else {
            return 0;
        }
    }
};

/**
 * Generate markup for each div
 * @param eachObjInPublishedArray
 * @returns {Element|*}
 */
var generateEachDiv = function (eachObjInPublishedArray) {
    var divNode;
    var textNode;
    var imgNode;
    var imgTitleNode;
    var imgFileNode;
    var lineSeparatorNode;
    var divWithDescriptionNode;

    divNode = document.createElement('div');

    imgNode = document.createElement('img');
    imgNode['src'] = "images/" + eachObjInPublishedArray['image_name'];
    divNode.appendChild(imgNode);

    imgTitleNode = document.createElement('div');
    imgTitleNode.className = "img-title";
    textNode = document.createTextNode(eachObjInPublishedArray['title']);
    imgTitleNode.appendChild(textNode);
    divNode.appendChild(imgTitleNode);

    imgFileNode = document.createElement('div');
    imgFileNode.className = "img-file";
    textNode = document.createTextNode(eachObjInPublishedArray['image_name']);
    imgFileNode.appendChild(textNode);
    divNode.appendChild(imgFileNode);

    divWithDescriptionNode = document.createElement('div');
    divWithDescriptionNode.className = "img-description";
    textNode = document.createTextNode(eachObjInPublishedArray['description']);
    divWithDescriptionNode.appendChild(textNode);
    divNode.appendChild(divWithDescriptionNode);

    return divNode;
};

/**
 *
 * @param publishedArray
 * @param contentEl
 */
var updateContentDiv = function (publishedArray,contentEl) {
    var newlyCreatedDivs = publishedArray.map(generateEachDiv);
    newlyCreatedDivs.forEach(function(eachNewlyCreatedDiv){
        contentEl.appendChild(eachNewlyCreatedDiv);
    });
};

/**
 * populate divs with json response callback
 */
var renderJsonContent = function(responseArray) {
    var contentEl = document.getElementsByClassName('content')[0];
    var publishedArray;

    // flush content in preparation for renedering new json data
    contentEl.innerHTML = "";
    // create temparray for entries where is_published === true
    publishedArray = responseArray.filter(function (eachObjInResponse) {
        return eachObjInResponse["is_published"] === true;
    });
    // sort publishedArray by img title (default behavior on pg load)
    // "A" sorts before "B"
    publishedArray = publishedArray.sort(sortObjByAttribute("title"));
    // update DOM to insert nodes using content from  publishedArray
    updateContentDiv(publishedArray,contentEl);
};

/**
 * call the main function
 */
renderDomFromResponse();