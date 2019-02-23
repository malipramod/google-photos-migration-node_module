let album = require('../modules/library/album');
let constant = require('../constants/constant')

let authToken = "ya29.Gl20BoFAPrCFDWTvPutaoogKehBvei80mVm84-nDX84fIMfdN_eTMWb_MCsppmigpBTnRRwOCxyIfoxp7CtFq0vua_0rSMZnAH2PWJU4c_gK5jEhzccuPo_G8x2dUmE";

function getAlbumsDemo() {
    album.getAlbums(authToken, "").then(
        (response) => {
            getItemsAlbumsDemo(response.data.albums[2])
        },
        (err) => {
            console.log(err.response.data.error.status);
        }
    );
}

function getItemsAlbumsDemo(albumData) {
    let length = (Math.floor(albumData.mediaItemsCount / constant.PAGESIZE) + 1);
    album.getAllItemsFromAlbum(albumData, authToken, length, "").then((response) => {
        console.log(response.length);
    });
}

function createAlbumDemo(albumName) {
    album.createAlbum(albumName, authToken).then(
        (response) => {
            console.log(response.data);
        },
        (err) => {
            console.log(err.response.data.error.status);
        }
    );
}
