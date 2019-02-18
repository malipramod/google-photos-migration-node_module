let album = require('../library/album');
let constant = require('../constants/constant')

let authToken = "ya29.Gl20BlQlMO3z6anpI8UXGF9BzWZh_tx_0GpHqCwcD4Xd92SAxmJtm0rSIAHZkiKLGoVf5E4uq-Qfi8Qog1kj6Hk7DX3aEEcpKTm19JN0Cdsf2IYVfNYY2kIaReWcW2E";
function getAlbums() {
    album.getAlbums(authToken, "").then(
        (data) => {
            getItemsAlbums(data.data.albums[1])
        },
        (err) => {
            console.log(err.response.data.error.status);
        }
    );
}

function getItemsAlbums(albumData) {
    let length = (Math.floor(albumData.mediaItemsCount / constant.PAGESIZE) + 1);
    console.log(album.getItemsAlbum(albumData, authToken, length, ""));
}

getAlbums();
