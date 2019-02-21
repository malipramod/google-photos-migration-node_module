var request = require("request").defaults({ encoding: null });;
const axios = require('axios');

const constants = require('../../config/constant');

let migratePhotos = async (authToken, mediaItems, albumId, callback) => {
    let batchSize = constants.BATCHSIZE;
    let responses = {};
    let response = [];
    let uploadTokens = {}; 
    uploadTokens.newMediaItems=[];
    uploadTokens.albumId = albumId;


    //If Token is empty
    if (!authToken) {
        responses.status = "Token Is Empty"
        responses.data = response;
        return responses;
    }

    let promiseArrayUploadToken = [];

    // mediaItems.forEach((mediaItem) => {
        for (let i = 0; i < mediaItems.length; i++) {
            promiseArrayUploadToken.push(
                new Promise((resolve,reject)=>{
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
                                uploadTokens.newMediaItems.push(uploadToken);
                                resolve(uploadTokens);
                            }).catch(ex => {
                                reject(ex.response.statusText);
                            });
                        } else {
                            reject(ex.response.statusText);
                        }
                    });
                })
            );            
        }

        await Promise.all(promiseArrayUploadToken);
        // return uploadTokens;
        
        let lastUploadToken = uploadTokens.newMediaItems[uploadTokens.newMediaItems.length-1].simpleMediaItem.uploadToken;
        let batchCreateModel ={};
        batchCreateModel.albumId=albumId;
        batchCreateModel.newMediaItems = [];

        let promiseArrayUpload=[];
        uploadTokens.newMediaItems.forEach(uploadToken => {
            let newMedia={};
            newMedia.description=uploadToken.description;
            newMedia.simpleMediaItem={};
            newMedia.SimpleMediaItem.uploadToken=uploadToken.uploadToken;
            batchCreateModel.newMediaItems.push(newMedia);
            if(batchCreateModel.newMediaItems.length % batchSize ===0 || uploadToken.Equals(lastElement)){
                promiseArrayUpload.push(
                    new Promise((resolve,reject)=>{
                        uploadMedia(authToken,batchCreateModel).then(data=>{
                            responses.push(data.data);
                            resolve(data);
                        }).catch(err=>{
                            reject(err)
                        })
                    })
                )
            }
        });
        await Promise.all(promiseArrayUpload);
        return responses;
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

function uploadMedia(authToken,body){
    let result={};
    return axios.post(`${constants.GOOGLEPHOTOURL}mediaItems:batchCreate`,JSON.stringify(body),{
        headers:{
            "Content-Type":"application/json",
            "Authorization":authToken
        }
    });
}
module.exports = {
    migratePhotos: migratePhotos
}