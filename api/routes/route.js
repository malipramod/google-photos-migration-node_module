const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const migrateController = require('./controllers/migrate-controller');

app.use(bodyParser.json());
app.use(express.json());

app.listen(port, function () {
    console.log(`Example app listening at ${port}`);
});

app.post('/', function (req, res) {   
    console.log(req.body)
    res.send("Hit");  
});
