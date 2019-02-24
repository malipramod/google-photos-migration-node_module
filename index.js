let album = require('./modules/library/album');
let migrate = require('./modules/migrate/migrate');

module.exports = {
    getAlbums: album.getAlbums,
    getAllItemsFromAlbum: album.getAllItemsFromAlbum,
    createAlbum: album.createAlbum,
    migrateAlbum: migrate.migrateAlbum
}