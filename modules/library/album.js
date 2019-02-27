let constants = require('../../constants/constant');
let axios = require('axios');

/**
 * Get 20 albums per call, Provide nextPageToken to get next 20 items
 * @param {string} authToken 
 * @param {string} nextPageToken 
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
 * main method to get all items from Album
 * @param {object} album                     Album Data
 * @param {string} authToken                 Auth Token
 * @param {number} length                    Length of Album (album content/batch size)
 * @param {string} nextPageToken             Next Page Token
 */
let getAllItemsFromAlbum = async (album, authToken, nextPageToken = "") => {
    let albumItems = [];
    let length = (Math.floor(album.mediaItemsCount / constants.PAGESIZE) + 1);
    for (let i = 0; i < length; i++) {
        let resp = await getItemsAlbumAPI(album, authToken, nextPageToken);
        albumItems.push(resp.mediaItems);
        nextPageToken = resp.nextPageToken;
    }
    return albumItems.flat();
}

/**
 * Support method to get all items from Album
 * @param {object} album 
 * @param {string} authToken 
 * @param {string} nextPageToken 
 */
function getItemsAlbumAPI(album, authToken, nextPageToken = "") {
    let body = {
        "pageSize": constants.PAGESIZE,
        "albumId": album.id
    }
    return axios.post(`${constants.GOOGLEPHOTOURL}mediaItems:search`, body, {
        headers: { 'Authorization': "Bearer " + authToken },
        params: { 'pageToken': nextPageToken ? nextPageToken : "" }
    }).then((response) => {
        return response.data;
    }, (err) => {
        return err.response.data.error;
    })
}

/**
 * Creates album
 * @param {string} albumName    Name of the album to create
 * @param {string} authToken    AuthToken 
 */
let createAlbum = (albumName, authToken) => {
    let body = {
        "album": {
            "title": albumName
        }
    };
    return axios.post(`${constants.GOOGLEPHOTOURL}albums`, body, {
        headers: {
            'Authorization': "Bearer " + authToken
        }
    });
}

/**
 * Method to Flat arrays within array, as it is directory not supported in nodejs
 */
Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth - 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});

/**
 * Exports all modules
 */
module.exports = {
    getAlbums: getAlbums,
    getAllItemsFromAlbum: getAllItemsFromAlbum,
    createAlbum: createAlbum
}
