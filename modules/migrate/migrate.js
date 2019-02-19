let constant = require('../../constants/constant');
let album = require('../library/album');

let migrateAlbum = (authToken, albumData) => {
    let length = (Math.floor(albumData.mediaItemsCount / constant.PAGESIZE) + 1);
    album.getAllItemsFromAlbum(albumData, authToken, length, "").then(
        (response) => {
            console.log(response.length);
        },
        (err) => {
            
        }
    )
}