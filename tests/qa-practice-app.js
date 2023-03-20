import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { check, group, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import { randomEmail, randomString } from '../utils/utils.js';

export const options = {
	stages: [
		{ duration: '1s', target: 1 },
		{ duration: '1s', target: 2 },
		{ duration: '1s', target: 0 },
	],
	thresholds: {
		'http_req_failed': ['rate<0.01'], // http errors should be less than 1%
		'http_req_duration': ['p(90) < 1000', 'p(95) < 1500', 'p(99.9) < 2000'],
	},
	summaryTrendStats: [
		'avg',
		'min',
		'med',
		'max',
		'p(50)',
		'p(90)',
		'p(95)',
		'count',
	],
	summaryTimeUnit: 'ms',
};

export function handleSummary(data) {
	return {
		'results.html': htmlReport(data),
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
	};
}

const BASE_URL_RV = 'https://qa-practice.netlify.app';
const REST_API_URL = 'http://localhost:8887';

const LANDING_PAGE_RV = new Trend('duration_time_landing_page');
const SPOT_BUGS_PAGE_RV = new Trend('duration_time_bugs_page');
const FETCH_API_PAGE_RV = new Trend('duration_time_fetch_api_page');
const FETCH_API_ENDPOINT_RV = new Trend('duration_time_fetch_api_endpoint');
const REST_API_GET_ALL_EMPLOYEES = new Trend('d_rest_get_all_employees');
const REST_API_POST_EMPLOYEE = new Trend('d_rest_post_employee');

let SLEEP_TIME = randomIntBetween(0.1, 0.2);

export default () => {
	group('QA-Practice landing page', () => {
		const res = http.get(`${BASE_URL_RV}`);
		check(res, {
			'Assert landing page HTML': (r) => r.body.includes('Welcome!') === true,
		});
		LANDING_PAGE_RV.add(res.timings.duration);
		sleep(SLEEP_TIME);
	});

	group('QA-Practice Fetch API Page', () => {
		const res = http.get(`${BASE_URL_RV}/fetch-api.html`);
		check(res, {
			'Assert fetch api page - api requests text': (r) =>
				r.body.includes('API requests') === true,
		});
		check(res, {
			'Assert fetch api page - Age table header': (r) =>
				r.body.includes('Age') === true,
		});
		FETCH_API_PAGE_RV.add(res.timings.duration);
		sleep(SLEEP_TIME);

		// test2
		const api_resp = http.get(`https://randomuser.me/api/?results=10`);
		check(api_resp, {
			'fetch api response status code': (res) => res.status == 200,
		});
		FETCH_API_ENDPOINT_RV.add(api_resp.timings.duration);
		sleep(SLEEP_TIME);
	});

	group('QA-Practice Spot the bugs page', () => {
		const res = http.get(`${BASE_URL_RV}/bugs-form.html`);
		check(res, {
			'Assert spot the bugs page HTML - 15 bugs text': (r) =>
				r.body.includes(
					'This page contains at least 15 bugs. How many of them can you spot?'
				) === true,
		});
		check(res, {
			'Assert spot the bugs page HTML - challenge text': (r) =>
				r.body.includes('CHALLENGE - Spot the BUGS!') === true,
		});
		SPOT_BUGS_PAGE_RV.add(res.timings.duration);
		sleep(SLEEP_TIME);
	});

	group('QA-Practice - REST API', () => {
		// GET ALL EMPLOYEES
		const res = http.get(`${REST_API_URL}/api/v1/employees`);
		check(res, {
			'api resp status code - get all employees': (res) => res.status == 200,
		});
		console.log(res);
		REST_API_GET_ALL_EMPLOYEES.add(res.timings.duration);
		sleep(SLEEP_TIME);

		// POST EMPLOYEE
		const requestBody = {
			email: randomEmail(),
			firstName: randomString(10),
			lastName: randomString(12),
		};
		const requestHeaders = {
			headers: { 'Content-Type': 'application/json' },
		};
		const res2 = http.post(
			`${REST_API_URL}/api/v1/employees`,
			JSON.stringify(requestBody),
			requestHeaders
		);
		check(res2, {
			'api resp status code - post employee': (res) => res.status == 201,
		});
		REST_API_POST_EMPLOYEE.add(res2.timings.duration);
		sleep(SLEEP_TIME);
	});
};
