let constant = require('../../constants/constant');
let album = require('../library/album');
let axios = require('axios')

/**
 * Migrates album from source to destination
 * @param {string} srcAuthToken 
 * @param {string} destAuthToken 
 * @param {object} albumData 
 */
let migrateAlbum = (srcAuthToken, destAuthToken, albumData) => {
    let length = (Math.floor(albumData.mediaItemsCount / constant.PAGESIZE) + 1);
    return album.getAllItemsFromAlbum(albumData, srcAuthToken, "").then((response) => {
        let body = {
            "mediaItems": response,
            "albumData": albumData
        }
        return axios.post(`${constant.GOOGLEMIGRATIONAPIHOSTED}migrateAlbum`, body, {
            headers:{
                "Authorization": destAuthToken,
                "Content-Type":"application/json"
            }
        })
    });
}

module.exports ={
    migrateAlbum:migrateAlbum
}
