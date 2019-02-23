const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const migrateController = require('./routes/controllers/migrate-controller');

app.use(bodyParser.json());
app.use(express.json());

app.listen(process.env.port || process.env.PORT || port, function () {
    console.log(`Example app listening at ${port}`);
});

app.post('/migrateAlbum', function (req, res) {    
    migrateController.migratePhotos(req.headers.authorization, req.body.mediaItems,req.body.albumData).then((data)=>{
        res.send(data);
    });
});

app.get('/', (req, res) => {
    res.sendFile('views/welcome.html', { root: __dirname });
})
