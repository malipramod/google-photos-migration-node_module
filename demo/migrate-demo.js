let axios = require('axios');
let album = require('../modules/library/album');
let constant = require('../constants/constant');

let srcAuthToken = "ya29.Gl24BuxqGFsxQFQPGyI7Cbv9CKWz5AVGaDaVruTtqRH1gCxSMp4lWmqBfj_qMvSE9ityrGJQsFTdijBafunwlbXV-lW7iosuDLGFsiXJAO6Kv4wmiZ6Aj9YpEn9TSPk";
let destAuthToken = "ya29.Gl24Bq0n2iuAiR5hlJDpzzvx3pHbVNsXMEBwzWc3KA2r0M9Sjh-GIOxQs1XqbtgQaRhqSPK8LdxvhUIihZN2t0GuNM7gqtuTmO5HM8KgGWMS0O75U85k09OiXUoKjeg";

function migrateAlbum() {
    album.getAlbums(srcAuthToken, "").then(
        (response) => {
            getItemsAlbumsDemo(response.data.albums[3]);
            // callback(album);
        },
        (err) => {
            console.log(err.response.data.error.status);
        }
    );
}

function getItemsAlbumsDemo(albumData) {
    let length = (Math.floor(albumData.mediaItemsCount / constant.PAGESIZE) + 1);
    album.getAllItemsFromAlbum(albumData, srcAuthToken, length, "").then((response) => {
        // console.log(albumData);
        let body = {
            "mediaItems": response,
            "albumData": albumData
        }
        axios.post(`${constant.GOOGLEMIGRATIONAPILOCAL}migrateAlbum`, body, {
            headers:{
                "Authorization": destAuthToken,
                "Content-Type":"application/json"
            }
        }).then(data => {
            console.log(JSON.stringify(data.data));
        })
    });
}

migrateAlbum();
