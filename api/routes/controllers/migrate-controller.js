var request = require("request").defaults({ encoding: null });;
const axios = require('axios');

const constants = require('../../config/constant');

let migratePhotos = (authToken, mediaItems, callback) => {
    let batchSize = constants.BATCHSIZE;
    let responses = {};
    let response = [];
    let newMediaItems = [];

    //If Token is empty
    if (!authToken) {
        responses.status = "Token Is Empty"
        responses.data = response;
        return responses;
    }
    let finishAll = [];

    mediaItems.forEach((mediaItem) => {
        for (let i = 0; i < mediaItems.length; i++) {
            mediaItem = mediaItems[i];
            let url = `${mediaItem.baseUrl}=w${mediaItem.mediaMetadata.width}-h${mediaItem.mediaMetadata.height}`;
            url = "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg";
            request.get(url, (err, res, body) => {
                if (!err) {
                    getUploadToken(mediaItem.filename, authToken, body).then((data) => {
                        let uploadToken = {};
                        uploadToken.description = mediaItem.filename;
                        uploadToken.simpleMediaItem = {};
                        uploadToken.simpleMediaItem.uploadToken = data;
                        newMediaItems.push(uploadToken);
                        callback(newMediaItems);
                    }).catch(ex => {
                        callback(ex.response.statusText);
                    });
                } else {
                    callback(err);
                }
            })
        }
    })
}

function getUploadToken(fileName, authToken, body) {
    return axios.post(`${constants.GOOGLEPHOTOURL}uploads`, body, {
        headers: {
            "X-Goog-Upload-Protocol": "raw",
            "X-Goog-Upload-File-Name": fileName,
            "Content-Type": "application/octet-stream",
            "Authorization": authToken
        }
    }).then((data) => {
        return data.data;
    });
}
module.exports = {
    migratePhotos: migratePhotos
}