require('dotenv').config();

const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');

app.use(bodyParser.json());

const port = process.env.PORT;

app.listen(port);
console.log('Magic happens at http://localhost:' + port);