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

// monster.io (Base URL)
const BASE_URL = "https://monster.com";

///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Resolves the url as relative to the base monster url
 * and returns the full URL
 */
const monsterRelativeUrl = url =>
	_.isString(url) ? `${BASE_URL}${url.replace(/^\/*?/, "/")}` : null;

/**
 * Extract a single post from container element
 */
const extractPost = elem => {
	const posHeader = elem.find('h2.title');
	const position = posHeader.find('a');
	const companyElem = elem.find('div.company');
	const company = companyElem.find('span.name');
	const time = elem.find('time');
	const locationElem = elem.find('div.location');
	const location = locationElem.find('span.name');
	const postingId = elem.attr('data-postingid');
	const jobId = elem.attr('data-jobid');

/*	return {
		position: fetchElemInnerText(position),
		href: BASE_URL + extractUrlAttribute('href')(position),
		company: fetchElemInnerText(company),
		companyLink: '',
		location: location,
		postingId: postingId,
		age: fetchElemInnerText(time),
		source: 'Monster',
		jobId: jobId
	};*/
	return {
		position: fetchElemInnerText(position),
		href: BASE_URL + extractUrlAttribute('href')(position),
		source: 'Monster',
		company: fetchElemInnerText(company),
		companyLink: '',
		age: fetchElemInnerText(time),
		location: fetchElemInnerText(location),
		postingId: jobId,
		jobId: jobId
	}
	
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
 * Extract posting from Monster's page using the Cheerio parser instance
 */
const extractJobPostings = $ => {
	console.log('here');
	const searchTitle = $('h1.pivot');
	console.log('here2');
	const metaDiv = $('div.mux-search-results');

	
	const extractPosts = extractFromElems(extractPost)();
	const searchResults = $('div[id="SearchResults"]');
	const jobPosts = searchResults.find("section.card-content");
	
	console.log('extract: ');
	console.log('then here');
	return Promise.all([
		fetchElemInnerText(searchTitle),
		extractUrlAttribute("data-total-search-results")(metaDiv),
		extractPosts(jobPosts)($)
	]).then( ([ title, totalResults, posts ]) => ({ title, totalResults, posts }) );

};

/**
 * Extract profile from a monster page using the Cheerio parser instance
 * and returns the job posting object
 */
const extractJobDetails = $ => {
	const content = $('div[name="value_description"]');
	const posterName = '';
	const employmentType = $('div[name="value_job_type"]').text();
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
 * Fetches the monster profile of the given job
 */
const fetchMonsterJobPostings = (keywords, location, offset) => {
	///jobs?q=recruiter&l=Chanhassen%2C+MN
	const SEARCH_URL = `${BASE_URL}/jobs/search/?q=${keywords}&where=${location}&page=${offset}`;
	console.log(SEARCH_URL);
	return composeAsync(extractJobPostings, fetchHtmlFromUrl)(SEARCH_URL);
};

/**
 * Fetches the details of the given job
 */
const getMonsterJobDetails = (id) => {
	const JOB_URL = `https://job-openings.monster.com/${id}`;
	return composeAsync(extractJobDetails, fetchHtmlFromUrl)(JOB_URL);
};

module.exports = { fetchMonsterJobPostings, getMonsterJobDetails };