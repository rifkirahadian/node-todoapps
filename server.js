require('dotenv').config();

const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const schedule = require('node-schedule')

app.use(bodyParser.json());

//route list
require('./routes/index')(app, express);

require('./modules/scheduler')()

const port = process.env.PORT;

app.listen(port);
console.log('Magic happens at http://localhost:' + port);