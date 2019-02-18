let constants = require('../constants/constant');
let axios = require('axios');

let albumItems = [];
/**
 * Get All albums
 */
let getAlbums = (authToken, nextPageToken = "") => {
    return axios.get(`${constants.GOOGLEPHOTOURL}albums`, {
        headers: {
            'Authorization': "Bearer " + authToken
        },
        params: { 'pageToken': nextPageToken ? nextPageToken : "" }
    });
}

/**
 * Get All media from Album
 * @param {albumData} album             Album Data
 * @param {string} authToken            Auth Token
 * @param {string} nextPageToken        Next Page Token
 */
let getItemsAlbum = (album, authToken, length, nextPageToken = "") => {
    console.log(length);
    let body = {
        "pageSize": constants.PAGESIZE,
        "albumId": album.id
    }
    axios.post(`${constants.GOOGLEPHOTOURL}mediaItems:search`, body, {
        headers: {
            'Authorization': "Bearer " + authToken
        },
        params: { 'pageToken': nextPageToken ? nextPageToken : "" }
    }).then((response) => {
        if (response.data.mediaItems)
            albumItems.push(response.data.mediaItems);

        if (length > 0) {
            nextPageToken = response.data.mediaItems.nextPageToken;
            length--;
            getItemsAlbum(album, authToken, length, nextPageToken);
        } else {
            return albumItems;
        }
    }, (err) => {
        return err.response.data.error;
    });
}


module.exports = {
    getAlbums: getAlbums,
    getItemsAlbum: getItemsAlbum
}
