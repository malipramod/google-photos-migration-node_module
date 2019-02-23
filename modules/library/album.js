let constants = require('../../constants/constant');
let axios = require('axios');

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
 * 
 * @param {object} album                     Album Data
 * @param {string} authToken                 Auth Token
 * @param {number} length                    Length of Album (album content/batch size)
 * @param {string} nextPageToken             Next Page Token
 */
let getAllItemsFromAlbum = async (album, authToken, length, nextPageToken = "") => {
    let albumItems = [];
    for (let i = 0; i < length; i++) {
        let resp = await getItemsAlbumAPI(album, authToken, nextPageToken);
        albumItems.push(resp.mediaItems);
        nextPageToken = resp.nextPageToken;
    }
    return albumItems.flat();
}

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
 * 
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

Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth - 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});

module.exports = {
    getAlbums: getAlbums,
    getAllItemsFromAlbum: getAllItemsFromAlbum,
    createAlbum: createAlbum
}