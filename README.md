# Google Photot Migration

Google Photos Migration Node Module

## How to install

Install Google Photos Migration Node Module by following command:

    npm i google-photos-migration

## Features

* [Get Albums Google Photos Account](#how-to-install "Get Albums Google Photos Account")
* [Create Album in Google Photos Account](#create-album "Create Album in Google Photos Account")
* [Get all media items from an Album in Google Photos Account](#get-all-items-from-album "Get all media items from an Album in Google Photos Account")
* [Migrate Album from one Google Photos account to another](#migrate-media "Migrate Album from one Google Photos account to another")

### Get Album

Gets all 20 albums per function call.

* **authToken:** Authorization token.

* **nextPageToken:** A continuation token to get the next page of the results. Adding this to the request returns the rows after the pageToken. The pageToken should be the value returned in the nextPageToken parameter in the response to the listAlbums request.

For More information please look into: demo/library-demo.js

``` JavaScript
    var googlePhotos = require('google-photos-migration');
    googlePhotos.getAlbums(authToken,nextPageToken);
```

### Create Album

Creates Album in Google Photos Library.

* **albumName:** Name of the album

* **authToken:** Authorization token.

For More information please look into: demo/library-demo.js

``` JavaScript
    var googlePhotos = require('google-photos-migration');
    googlePhotos.createAlbum(albumName, authToken);
```

### Get all items from Album

Get all items from an album.

``` JavaScript
    var googlePhotos = require('google-photos-migration');
    googlePhotos.getAllItemsFromAlbum(albumData, authToken, length,nextPageToken);
```

For More information please look into: demo/library-demo.js

### Migrate media

Migrates an album from one Google Photos account to another.

``` JavaScript
    var googlePhotos = require('google-photos-migration');
    googlePhotos.migrateAlbum(srcAuthToken, destAuthToken, albumData);
```

For More information please look into: demo/migrate-demo.js

API code for Migration is avaialble at:

NodeJS: <https://github.com/malipramod/google-photos-migration-api-nodejs>

C#:     <https://github.com/malipramod/google-photos-migration-api-csharp>

NPM package: <https://www.npmjs.com/package/google-photos-migration>