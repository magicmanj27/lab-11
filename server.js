'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;


// Application Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
// Renders the search form
app.get('/', newSearch);

// Create a new search to the Google Boos API
app.post('/searches', createSearch);

// Catch-all
app.get('*', (request, response) => response.status(404).send('This page does not exist!'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// The Helper Function to get started
// Only show part of this to get started
function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';



  this.title = info.title ? info.title : 'No title available';



  this.image = info.imageLinks ? info.imageLinks.thumbnail.replace('http:', 'https:') : placeholderImage;

  console.log(this.image);



  this.description = info.description ? info.description : 'No description available';

}

function newSearch(resquest, response) {
  response.render('pages/index');
}

function createSearch(request, response) {
  console.log(request.body);

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.search[1] === 'title') {
    url += `+intitle:${request.body.search[0]}`;
  }
  if (request.body.search[1] === 'author') {
    url += `+inauthor:${request.body.search[0]}`;
  }

  console.log(url);
  // response.send('OK');

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/searches/show', { arrayOfItems: results }))
    .catch(error => response.render('pages/searches/error', { error : error }));
}

// function handleError(error, response) {
//   response.render('pages/error', { error : error });
// }




