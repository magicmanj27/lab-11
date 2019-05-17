'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Application Setup
const app = express();
const PORT = process.env.PORT;

//Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//Express middleware
//Utilize expressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');


app.use(methodOverride(function (request, response) {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));


// API Routes
// Renders the search form
// app.get('/', homePage);

app.get('/', getBooks);
app.get('/searches', newSearch);

//Localhost:3000/tasks/1
app.get('/books/:book_id', getOneBook);
app.get('/add', showForm);
app.post('/add', addBook);
app.put('/update/:book_id', updateBook);


// Catch-all
app.get('*', (request, response) => response.status(404).send('This page does not exist!'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//Helper functions

function getBooks(request, response) {
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
    .then(results => {
      console.log(results.rows);
      response.render('index', { results: results.rows })
    })
    .catch(error => handleError(error, response));
}

function getOneBook(request, response) {
  console.log('BOOK ID = ', request.params.book_id);

  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [request.params.book_id];

  return client.query(SQL, values)
    .then(result => {
      return response.render('pages/detail', { book: result.rows[0] });
    })
    .catch(error => handleError(error, response));
}

function showForm(request, response) {
  response.render('pages/add')
}

function addBook(request, response) {
  console.log('🤨', request.body);

  let { title, author, isbn, image, description } = request.body;
  console.log('This is title: ', title);

  let SQL = 'INSERT INTO books (title, author, isbn, image, description) VALUES ($1, $2, $3, $4, $5);';
  let values = [title, author, isbn, image, description];

  return client.query(SQL, values)
    .then(result => {
      console.log(result);
      response.redirect('/')
    })
    .catch(error => handleError(error, response));
}

function updateBook(request, response) {
  let { title, author, isbn, image, description } = request.body;

  let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image=$4, description=$5 WHERE id=$6`;

  let values = [title, author, isbn, image, description, request.params.book_id];

  client.query(SQL, values)
    .then(response.redirect(`/books/${request.params.book_id}`))
    .catch(error => handleError(error, response));
}






// Create a new search to the Google Books API
app.post('/searches', createSearch);



// The Helper Function to get started
// Only show part of this to get started
function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title ? info.title : 'No title available';
  this.author = info.authors ? info.authors[0] : 'No Author Available';
  this.isbn = info.industryIdentifiers ? `${info.industryIdentifiers[0].identifier}` : 'ISBN not available';
  this.image = info.imageLinks ? info.imageLinks.thumbnail.replace('http:', 'https:') : placeholderImage;
  console.log(this.image);
  this.description = info.description ? info.description : 'No description available';
  this.id = info.industryIdentifiers ? `${info.industryIdentifiers[0].identifier}` : '';
}

function newSearch(request, response) {
  response.render('pages/searches/new');
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
    .catch(error => handleError(error, response));
}

function handleError(error, response) {
  console.log(error);
  response.render('pages/searches/error', { error: 'Uh Oh - Something when wrong...' });
}





