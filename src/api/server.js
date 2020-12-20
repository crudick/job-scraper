
// Require dependencies
const logger = require('morgan');
const express = require('express');

// Create an Express application
const app = express();

// Configure the app port
const port = process.env.PORT || 3000;
app.set('port', port);

// Load middlewares
app.use(logger('dev'));

// Start the server and listen on the preconfigured port
app.listen(port, () => console.log(`App started on port ${port}.`));


// Require the needed functions
const { sendResponse } = require('./helpers');
const { fetchJobPostings } = require('./linkedin');
const { getJobDetails } = require('./linkedin');
const { fetchIndeedJobPostings } = require('./indeed');
const { getIndeedJobDetails } = require('./indeed');
const { fetchMonsterJobPostings } = require('./monster');
const { getMonsterJobDetails } = require('./monster');



// Add the linkedin search route
app.get('/api/linkedin', (req, res, next) => {
	console.log('in here');
  let keywords = req.query.keywords;
  let city = req.query.city;
  let state = req.query.state;
  let location = req.query.location;
  let page = req.query.page;
  sendResponse(res)(fetchJobPostings(keywords, location, page));
});


// Add the linkedin details route
app.get('/api/linkedin/job/:id', (req, res, next) => {
  let id = req.params.id;
  sendResponse(res)(getJobDetails(id));
});

// Add the indeed search route
app.get('/api/indeed', (req, res, next) => {
  let keywords = req.query.keywords;
  let city = req.query.city;
  let state = req.query.state;
  let location = req.query.location;
  let offset = req.query.offset;
  sendResponse(res)(fetchIndeedJobPostings(keywords, location, offset));
});


// Add the indeed details route
app.get('/api/indeed/job/:id', (req, res, next) => {
  let id = req.params.id;
  sendResponse(res)(getIndeedJobDetails(id));
});

// Add the Monster job search route
app.get('/api/monster', (req, res, next) => {
  let keywords = req.query.keywords;
  let city = req.query.city;
  let state = req.query.state;
  let location = req.query.location;
  let offset = req.query.offset;
  sendResponse(res)(fetchMonsterJobPostings(keywords, location, offset));
});


// Add the Monster job details route
app.get('/api/monster/job/:id', (req, res, next) => {
  let id = req.params.id;
  sendResponse(res)(getMonsterJobDetails(id));
});