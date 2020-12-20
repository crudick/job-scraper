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
const LINKEDIN_BASE = "https://www.linkedin.com/jobs/";

///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Resolves the url as relative to the base scotch url
 * and returns the full URL
 */
const scotchRelativeUrl = url =>
	_.isString(url) ? `${LINKEDIN_BASE}${url.replace(/^\/*?/, "/")}` : null;

/**
 * Extract a single post from container element
 */
const extractPost = elem => {

	const position = elem.find('a.result-card__full-card-link');
	const company = elem.find('a[data-tracking-control-name="public_jobs_job-result-card_result-card_subtitle-click"]');
	const time = elem.find('time.job-result-card__listdate');
	const location = elem.find('span.job-result-card__location');
	const postingId = elem.attr('data-id');
	const jobId = elem.attr('data-entity-urn');
	return {
		position: fetchElemInnerText(position),
		href: extractUrlAttribute('href')(position),
		company: fetchElemInnerText(company),
		location: fetchElemInnerText(location),
		postingId: postingId,
		age: fetchElemInnerText(time),
		source: 'LinkedIn',
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
	
	const searchTitle = $('span.results-context-header__query-search');
	const totalResults = $('span.results-context-header__job-count');
	const extractPosts = extractFromElems(extractPost)();
	const joblist = $('ul.jobs-search__results-list');
	const jobPosts = joblist.find("li.job-result-card");
	
	console.log('jobs: ' + jobPosts.length);
	return Promise.all([
		fetchElemInnerText(searchTitle),
		fetchElemInnerText(totalResults),
		extractPosts(jobPosts)($)
	]).then(([ title, totalResults, posts ]) => ({ title, totalResults, posts }));

};

/**
 * Extract profile from a Scotch author's page using the Cheerio parser instance
 * and returns the author profile object
 */
const extractJobDetails = $ => {
	const posterName = $('p.poster__name');
	const content = $('div.show-more-less-html__markup');

	// Recruiter Details
	const recruiterDiv = $('div.message-the-recruiter');
	const recruiterName = recruiterDiv.find('h3.base-main-card__title');
	const recruiterDetails = recruiterDiv.find('h4.base-main-card__subtitle');
	var rName;
	var rSubtitles;
	var rArr =  fetchElemInnerText(recruiterName) == null ? [] : fetchElemInnerText(recruiterName).split(',');
	if(rArr.length > 0){
		rName = rArr.shift();
		rSubtitles = rArr.join(',');
	}

	// Job Functions
	const extractedFunctions = extractFromElems(extractJobFunction)();
	const functionElement = $('ul.job-criteria__list');
	const functionlist = functionElement.find('li.job-criteria__item');
	var attributes = extractedFunctions(functionlist)($)
	var employmentType;
	var seniorityLevel;
	attributes.forEach(attr =>{
		if(attr.key == 'Employment type') {
			employmentType = attr.value;
		} else if(attr.key == 'Seniority level'){
			seniorityLevel = attr.value;
		}
	});
	return Promise.all([
		fetchElemInnerText(posterName),
		employmentType,
		seniorityLevel,
		content.html(),
		{ 
			name: rName, 
			subtitles: rSubtitles,
			details: fetchElemInnerText(recruiterDetails) 
		}
	]).then(([ name, employmentType, seniorityLevel, summary, recruiter ]) => ({ name, employmentType, seniorityLevel, summary, recruiter }));

};

/**
 * Fetches the Scotch profile of the given author
 */
const fetchJobPostings = (keywords, location, page) => {
	const SEARCH_URL = `${LINKEDIN_BASE}search/?keywords=${keywords}&location=${location}&page=${page}`;
	return composeAsync(extractJobPostings, fetchHtmlFromUrl)(SEARCH_URL);
};

/**
 * Fetches the Scotch profile of the given author
 */
const getJobDetails = (id) => {
	const JOB_URL = `${LINKEDIN_BASE}view/${id}`;
	return composeAsync(extractJobDetails, fetchHtmlFromUrl)(JOB_URL);
};

module.exports = { fetchJobPostings, getJobDetails };