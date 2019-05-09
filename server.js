'use strict';

const express = require('express');
const superagent = require('superagent');

const app = express();

app.set('view engine', 'ejs');

app.get('/', newSearch);

app.get('*', (request, response) => response.status(404).send('This route does not exist!'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function newSearch(resquest, response) {
  response.render('pages/index');
}




