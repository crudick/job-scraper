const _ = require('lodash');

// Import helper functions
const {
	compose,
	composeAsync,
	extractNumber,
	enforceHttpsUrl,
	fetchHtmlFromUrl,
	extractFromElems,
	fromPairsToObject,
	fetchElemInnerText,
	fetchElemAttribute,
	extractUrlAttribute
} = require("./helpers");

// scotch.io (Base URL)
const BASE_URL = "https://indeed.com";

///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Resolves the url as relative to the base scotch url
 * and returns the full URL
 */
const scotchRelativeUrl = url =>
	_.isString(url) ? `${BASE_URL}${url.replace(/^\/*?/, "/")}` : null;

/**
 * Extract a single post from container element
 */
const extractPost = elem => {

	const position = elem.find('a[data-tn-element="jobTitle"]');
	const company = elem.find('a[data-tn-element="companyName"]');
	const time = elem.find('div.result-link-bar').find('span.date');
	const location = elem.find('div.recJobLoc').attr('data-rc-loc');
	const postingId = elem.attr('id').split('_')[1];
	const jobId = elem.attr('id').split('_')[1];
	return {
		position: fetchElemInnerText(position),
		href: BASE_URL + extractUrlAttribute('href')(position),
		company: fetchElemInnerText(company),
		companyLink: BASE_URL + extractUrlAttribute('href')(company),
		location: location,
		postingId: postingId,
		age: fetchElemInnerText(time),
		source: 'Indeed',
		jobId: jobId
	};
};

/**
 * Extract a single post from container element
 */
const extractJobFunction = elem => {

	const key = fetchElemInnerText(elem.find('h3.job-criteria__subheader'));
	const value = employmentType = fetchElemInnerText(elem.find('span.job-criteria__text'));
	return {
		key: key,
		value: value
	};
};


/**
 * Extract profile from a Scotch author's page using the Cheerio parser instance
 * and returns the author profile object
 */
const extractJobPostings = $ => {
	
	const searchTitle = $('h1[id="jobsInLocation"]');
	const totalResultsText = $('div[id="searchCountPages"]').text().trim();
	let totalResults = 0;
	console.log(totalResultsText);
	if(totalResultsText.split(' ').length >= 4){
		totalResults = totalResultsText.split(' ')[3];
	}	
	

	const extractPosts = extractFromElems(extractPost)();
	const jobPosts = $("div.jobsearch-SerpJobCard");
	
	return Promise.all([
		fetchElemInnerText(searchTitle),
		totalResults,
		extractPosts(jobPosts)($)
	]).then(([ title, totalResults, posts ]) => ({ title, totalResults, posts }));

};

/**
 * Extract profile from a Scotch author's page using the Cheerio parser instance
 * and returns the author profile object
 */
const extractJobDetails = $ => {
	const content = $('div[id="jobDescriptionText"]');
	const posterName = '';
	const employmentType = '';
	const seniorityLevel = '';

	return Promise.all([
		posterName,
		employmentType,
		seniorityLevel,
		content.html(),
		{ 
			name: '', 
			subtitles: '',
			details: ''
		}
	]).then(([ name, employmentType, seniorityLevel, summary, recruiter ]) => ({ name, employmentType, seniorityLevel, summary, recruiter }));

};

/**
 * Fetches the Scotch profile of the given author
 */
const fetchIndeedJobPostings = (keywords, location, offset) => {
	///jobs?q=recruiter&l=Chanhassen%2C+MN
	const SEARCH_URL = `${BASE_URL}/jobs/?q=${keywords}&l=${location}&start=${offset}`;
	return composeAsync(extractJobPostings, fetchHtmlFromUrl)(SEARCH_URL);
};

/**
 * Fetches the details of the given job
 */
const getIndeedJobDetails = (id) => {
	const JOB_URL = `${BASE_URL}/viewjob?jk=${id}`;
	return composeAsync(extractJobDetails, fetchHtmlFromUrl)(JOB_URL);
};

module.exports = { fetchIndeedJobPostings, getIndeedJobDetails };