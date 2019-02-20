var request = require("request");
const fs = require('fs');
const constants = require('../../config/constant');

let migratePhotos = (authToken, mediaItems) => {
    let batchSize = constants.BATCHSIZE;
    let responses = {};
    let response = [];
    let uploadTokens = [];

    //If Token is empty
    if (!authToken) {
        responses.status = "Token Is Empty"
        responses.data = response;
        return responses;
    }

    mediaItems.forEach(mediaItem => {
        let url = `${mediaItem.baseUrl}=w${mediaItem.mediaMetadata.width}-h${mediaItem.mediaMetadata.height}`;
        console.log(url);        
    });
}

function uploadMedia() {

}
module.exports = {
    migratePhotos: migratePhotos
}