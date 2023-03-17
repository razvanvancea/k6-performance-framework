import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

export const options = {
	stages: [{ target: 1, duration: '1' }],
	thresholds: {
		http_req_duration: ['p(95)<1000', 'p(99)<1500'],
	},
};

const BASE_URL = 'http://localhost:8887';

export function setup() {
	const requestBody = {
		password: 'admin',
		username: 'admin',
	};

	const params = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const res = http.post(
		`${BASE_URL}/api/v1/simulate/token`,
		JSON.stringify(requestBody),
		params
	);

	// console.log(JSON.stringify(res));

	check(res, { 'user authenticated': (r) => r.status === 200 });

	const authToken = res.json('token');

	return authToken;
}

export default (authToken) => {
	const requestHeadersDefault = () => ({
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});

	group('API endpoints with auth required', () => {
		let URL = `${BASE_URL}/api/v1/simulate/get/employees`;

		group('GET employees', () => {
			const res = http.get(URL, {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			});

			if (
				check(res, { 'get employees status code': (r) => r.status === 200 })
			) {
				console.log(`test passed`);
			} else {
				console.log(`Unable to get employees ${res.status} ${res.body}`);
				// console.log(`Unable to get employees ${JSON.stringify(res)}`);
				// console.log(`Unable to get employees ${JSON.stringify(res.request)}`);
				return;
			}
		});
	});

	sleep(1);
};
