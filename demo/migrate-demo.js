let album = require('../modules/library/album');
let migrateAlbum = require('../modules/migrate/migrate');

let srcAuthToken = "ya29.Gl26BuKIh541EawR4sVAAkiB_LE3MfmKnfv-WxrycaUPNW2IAE2fH9b1eg-i7Hdh-f6ObFVfdeiGxcHIHZM3J95FeCojozJkjqBdEA2mpik7xseDGZVH_SJZvi9hSak";
let destAuthToken = "ya29.Gl26Bpkq0GFPF0nh_zXgxJT8r4WXAddxXq9jx0bHm8lNQU27E2JYa45hTywcZhhiTrDeUuVwrjo7Unzhlz_CJzusKsC9A0cHWtHp1rw6o4DWvHkhUN4OmipLtvAL3dk";

function migrateAlbumDemo() {
    album.getAlbums(srcAuthToken, "").then(
        (response) => {
            migrateAlbum.migrateAlbum(srcAuthToken, destAuthToken, response.data.albums[0]).then((migrateData) => {
                console.log(JSON.stringify(migrateData.data));
            }).catch(err => {
                console.log(err);
            })
        },
        (err) => {
            console.log(err.response.data.error.status);
        }
    );
}

migrateAlbumDemo();
