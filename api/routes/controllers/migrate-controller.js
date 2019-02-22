var request = require("request").defaults({ encoding: null });;
const axios = require('axios');

const constants = require('../../config/constant');

let migratePhotos = async (authToken, mediaItems, albumData) => {
    let batchSize = constants.BATCHSIZE;
    let responses = {};
    let uploadTokens = {};
    uploadTokens.newMediaItems = [];

    //If Token is empty
    if (!authToken) {
        let response = {};
        response.status = "Token Is Empty"
        response.data = response;
        responses.push(response);
        return responses;
    }

    let albumId = await createAlbum(albumData, authToken);

    let promiseArrayUploadToken = [];

    for (let i = 0; i < mediaItems.length; i++) {
        promiseArrayUploadToken.push(
            new Promise((resolve, reject) => {
                mediaItem = mediaItems[i];
                let url = `${mediaItem.baseUrl}=w${mediaItem.mediaMetadata.width}-h${mediaItem.mediaMetadata.height}`;
                request.get(url, (err, res, body) => {
                    if (!err) {
                        getUploadToken(mediaItem.filename, authToken, body).then((data) => {
                            let uploadToken = {};
                            uploadToken.description = mediaItem.filename;
                            uploadToken.simpleMediaItem = {};
                            uploadToken.simpleMediaItem.uploadToken = data;
                            uploadTokens.newMediaItems.push(uploadToken);
                            resolve(uploadTokens);
                        }).catch(ex => {
                            reject(ex);
                        });
                    } else {
                        reject(ex);
                    }
                });
            })
        );
    }

    await Promise.all(promiseArrayUploadToken);

    let lastUploadToken = uploadTokens.newMediaItems[uploadTokens.newMediaItems.length - 1].simpleMediaItem.uploadToken;
    let batchCreateModel = {};
    batchCreateModel.albumId = albumId.data.id;
    batchCreateModel.newMediaItems = [];

    let promiseArrayUpload = [];
    for (let i = 0; i < uploadTokens.newMediaItems.length; i++) {
        let uploadToken = uploadTokens.newMediaItems[i];
        let newMedia = {};
        newMedia.description = uploadToken.description;
        newMedia.simpleMediaItem = {};
        newMedia.simpleMediaItem.uploadToken = uploadToken.simpleMediaItem.uploadToken;
        batchCreateModel.newMediaItems.push(newMedia);
        if (batchCreateModel.newMediaItems.length % constants.batchSize == 0 || uploadToken.simpleMediaItem.uploadToken == lastUploadToken) {
            promiseArrayUpload.push(
                new Promise((resolve, reject) => {
                    uploadMedia(authToken, batchCreateModel).then(data => {
                        responses.newMediaItemResults = [];
                        responses.newMediaItemResults.push(data.data);
                        resolve(responses);
                    }).catch(err => {
                        reject(err.response)
                    })
                })
            )
        }
    }

    await Promise.all(promiseArrayUpload);
    return responses;
}

function createAlbum(albumData, authToken) {
    let body = {
        "album": {
            "title": albumData.title
        }
    };
    return axios.post(`${constants.GOOGLEPHOTOURL}albums`, body, {
        headers: {
            'Authorization': "Bearer " + authToken
        }
    });
}
function getUploadToken(fileName, authToken, body) {
    return axios.post(`${constants.GOOGLEPHOTOURL}uploads`, body, {
        headers: {
            "X-Goog-Upload-Protocol": "raw",
            "X-Goog-Upload-File-Name": fileName,
            "Content-Type": "application/octet-stream",
            "Authorization": "Bearer " + authToken
        }
    }).then((data) => {
        return data.data;
    }).catch(err => {
        return err
    });
}

function uploadMedia(authToken, body) {
    return axios.post(`${constants.GOOGLEPHOTOURL}mediaItems:batchCreate`, JSON.stringify(body), {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
        }
    });
}
module.exports = {
    migratePhotos: migratePhotos
}