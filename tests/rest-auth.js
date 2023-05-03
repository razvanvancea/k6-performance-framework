import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { check, fail, group, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options = {
	stages: [
		{ duration: '1s', target: 1 },
		{ duration: '5s', target: 5 },
		{ duration: '5s', target: 2 },
		{ duration: '3s', target: 0 },
	],
	thresholds: {
		http_req_duration: ['p(95)<4000', 'p(99)<5000'],
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

let SLEEP_TIME = randomIntBetween(0.5, 1);

const BASE_URL = 'https://admin-rv.dev.ro';

const API_GET_DEPARTMENTS = new Trend('duration_get_departments');

export function handleSummary(data) {
	return {
		'results.html': htmlReport(data),
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
	};
}

export function setup() {
	const params = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};

	const REQUEST_BODY = {
		email: 'iamrv@gmail.com',
		password: 'Razvan',
	};

	const res = http.post(`${BASE_URL}/api/tokens`, REQUEST_BODY, params);

	// console.log(JSON.stringify(res));

	check(res, { 'user authenticated': (r) => r.status === 200 });

	const authToken = res.json('token');

	return authToken;
}

export default (authToken) => {
	group('GET departments endpoint test', () => {
		const res = http.get(`${BASE_URL}/api/departments`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		if (check(res, { 'GET departments status code': (r) => r.status === 200 })) {
			console.log(`GET departments - passed`);
		} else {
			console.log(`Unable to GET Departments ${res.status} ${res.body}`);
			return;
		}

		API_GET_DEPARTMENTS.add(res.timings.duration);
		sleep(SLEEP_TIME);
	});

	sleep(1);
};

