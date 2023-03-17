import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { Trend } from 'k6/metrics';

export const options = {
	stages: [
		{ duration: '1s', target: 1 },
		{ duration: '1s', target: 2 },
		{ duration: '1s', target: 0 },
	],
	thresholds: {
		'http_req_duration{status:200}': ['max>=0'],
		'http_req_duration{status:499}': ['max>=0'],
		'http_req_duration{status:502}': ['max>=0'],
		'http_req_duration{status:503}': ['max>=0'],
		'http_req_duration{status:504}': ['max>=0'],
		'http_req_duration{status:500}': ['max>=0'],
		'http_req_duration{status:501}': ['max>=0'],
		'http_req_duration{status:404}': ['max>=0'],
	},
	summaryTrendStats:['avg', 'min', 'med', 'max', 'p(50)', 'p(90)', 'p(95)', 'count'],
	summaryTimeUnit: 'ms',
};

export function handleSummary(data) {
	return {
		'results.html': htmlReport(data),
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
	};
}

const BASE_URL_RV = 'https://qa-practice.netlify.app';
const LANDING_PAGE_RV = new Trend('duration_time_landing_page');
const SPOT_BUGS_PAGE_RV = new Trend('duration_time_bugs_page');
let SLEEP_TIME = randomIntBetween(0.1, 0.2); // This is the delay time between requests.

const BFpage = new Trend('duration_time_BF');
const SEARCHpage = new Trend('duration_time_SEARCH');
const CATEGORYfilters = new Trend('duration_category_filters');
const CATEGORYpage = new Trend('duration_category_page');
const HOMEpage = new Trend('duration_homepage');
const ADDcart = new Trend('duration_add_cart');
const REMOVEcart = new Trend('duration_remove_cart');
const VIEWcart = new Trend('duration_view_cart');

//const base_url = "https://dev01-stgmach.dev.flanco.ro"; //stg
const base_url = 'https://www.flanco.ro'; //prod
const black_friday_campaign_url = base_url + '/campanie/black-friday-2022';

const category_url = base_url + '/tv-electronice-foto/televizoare.html'; //prod
// const category_url = base_url+"/tv-audio-video-foto/televizoare.html" // stg
const category_filters_url =
	base_url + '/tv-electronice-foto/televizoare/filtre/brand/lg.html';
const product_url =
	base_url + '/televizor-smart-led-lg-43up75003lf-108-cm-ultra-hd-4k.html';
const search_url1 = base_url + '/catalogsearch/result/?q=apple';
const add_to_cart_url = base_url + '/comanda/cart/addAjax/';
const remove_from_cart_url = base_url + '/comanda/cart/delete/';
const cart_url = base_url + '/comanda/previzualizare/';

const create_account_page_url = base_url + '/customer/account/create/';
const create_account_url = base_url + '/customer/account/createpost/';
const order_details = base_url + '/comanda/detalii/';
const order_details_ajax_url = base_url + '/comanda/detalii/ajax/';
const add_new_address_url = base_url + '/customer/address/ajax/';
const shipping_information_url =
	base_url + '/rest/default/V1/carts/mine/shipping-information';
const obtain_authentication_token_url =
	base_url + '/rest/V1/integration/customer/token';
const finalize_order_url =
	base_url + '/rest/default/V1/carts/mine/payment-information';
const obtain_cart_id_url = base_url + '/rest/V1/carts/mine';
const obtain_customer_id_url = base_url + '/rest/V1/customers/me';

const test_homepage_text = 'Urmareste comanda';
const test_category_page_text = 'Televizoare';
const test_product_page_text = 'Televizor Smart LED';
const test_search_page_text = "Rezultate pentru: 'apple'";
const test_cart_page_text = 'Coș de cumpărături';
const est_cart_page_text_empty = 'Cosul de cumparaturi este gol';
const test_account_create_page_text = 'Inregistreaza-te';
const lastname = 'Jmeter';
const firstname = 'Performance';
const password = 'Aa123456789!';
const password_confirmation = 'Aa123456789!';

export default function () {
	group('QA-Practice landing page', function () {
		//========================↓    NEW SCENARIO BELOW    ↓=================================//
		let res = http.get(`${BASE_URL_RV}`);
		let checkRes = check(res, {
			'Assert landing page HTML': (r) => r.body.includes('Welcome!') === true,
		});
		// checkRes += check(res, {
		//     "Black friday campaign status 200": (r) => r.status === 200
		// });
		LANDING_PAGE_RV.add(res.timings.duration);
		sleep(SLEEP_TIME);
	});

	group('QA-Practice Spot the bugs page', function () {
		//========================↓    NEW SCENARIO BELOW    ↓=================================//
		let res = http.get(`${BASE_URL_RV}/bugs-form.html`);
		let checkRes = check(res, {
			'Assert spot the bugs page HTML - 15 bugs text': (r) =>
				r.body.includes(
					'This page contains at least 15 bugs. How many of them can you spot?'
				) === true,
		});
		checkRes = check(res, {
			'Assert spot the bugs page HTML - challenge text': (r) =>
				r.body.includes(
					'CHALLENGE - Spot the BUGS!'
				) === true,
		});
		// checkRes += check(res, {
		//     "Black friday campaign status 200": (r) => r.status === 200
		// });
		SPOT_BUGS_PAGE_RV.add(res.timings.duration);
		sleep(SLEEP_TIME);
	});

	// group("BF campaign page", function() {
	//     //========================↓    NEW SCENARIO BELOW    ↓=================================//
	//     let res = http.get(`${black_friday_campaign_url}`);
	//     let checkRes = check(res, {
	//         "Black friday campaign assert": (r) => r.body.includes("Masini de spalat rufe si uscatoare") === true
	//     });
	//     checkRes += check(res, {
	//         "Black friday campaign status 200": (r) => r.status === 200
	//     });
	//     BFpage.add(res.timings.duration);
	//     sleep(SLEEP_TIME);
	// });

	// group("Search", function() {
	//     //========================↓    NEW SCENARIO BELOW    ↓=================================//

	//     let res = http.get(`${search_url1}`);
	//     let checkRes = check(res, {
	//         "Search results page assert": (r) => r.body.includes("Rezultate pentru") === true
	//     });
	//     checkRes = check(res, {
	//         "Search apple assert": (r) => r.body.includes("apple") === true
	//     });
	//     checkRes += check(res, {
	//         "Search apple status 200": (r) => r.status === 200
	//     });
	//     SEARCHpage.add(res.timings.duration);
	//     sleep(SLEEP_TIME);
	// });

	// group("Category, homepage & cart", function() {
	//     //========================↓    NEW SCENARIO BELOW    ↓=================================//

	//     let res = http.get(`${category_filters_url}`);
	//     let checkRes = check(res, {
	//         "Products listing with filters": (r) => r.body.includes(`${test_category_page_text}`) === true
	//     });
	//     checkRes += check(res, {
	//         "Products listing with filters status 200": (r) => r.status === 200
	//     });
	//     CATEGORYfilters.add(res.timings.duration);
	//     sleep(SLEEP_TIME);

	//     //========================↓    NEW SCENARIO BELOW    ↓=================================//
	//     res = http.get(`${category_url}`);
	//     checkRes = check(res, {
	//         "Category page assert": (r) => r.body.includes(`${test_category_page_text}`) === true
	//     });
	//     checkRes += check(res, {
	//         "Category page status 200": (r) => r.status === 200
	//     });

	//     const uenc = res
	//         .html()
	//         .find("input[name=uenc]")
	//         .first()
	//         .attr("value");

	//     const product = res
	//         .html()
	//         .find("input[name=product]")
	//         .first()
	//         .attr("value");

	//     const add_to_cart_url2 = res
	//         .html()
	//         .find("form[data-role=tocart-form]")
	//         .first()
	//         .attr("action");

	//     const product_sku = res
	//         .html()
	//         .find("form[data-role=tocart-form]")
	//         .first()
	//         .attr("data-product-sku");

	//     CATEGORYpage.add(res.timings.duration);
	//     sleep(SLEEP_TIME);

	//     //========================↓    NEW SCENARIO BELOW    ↓=================================//

	//     res = http.get(`${base_url}`);
	//     checkRes = check(res, {
	//         "Homepage assert": (r) => r.body.includes("Urmareste comanda") === true
	//     });
	//     checkRes += check(res, {
	//         "Homepage status 200": (r) => r.status === 200
	//     });

	//     const form_key = res
	//         .html()
	//         .find("input[name=form_key]")
	//         .first()
	//         .attr("value");
	//     HOMEpage.add(res.timings.duration);
	//     sleep(SLEEP_TIME);

	//     //========================↓    NEW SCENARIO BELOW    ↓=================================//

	//     const params = {
	//         headers: {
	//             'X-Requested-With': 'XMLHttpRequest',
	//             'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
	//             'cookie': `form_key=${form_key};`
	//         },
	//         redirects: 0,
	//     };

	//     res = http.post(add_to_cart_url,
	//         `product=${product}&uenc=${uenc}&form_key=${form_key}`,
	//         params, { follow: false});

	//     checkRes = check(res, {
	//         "Cart page status 200": (r) => r.status === 200
	//     });
	//     checkRes = check(res, {
	//         "Post add to cart response assert": (r) => r.body.includes("Your session has expired!") === false
	//     });
	//     ADDcart.add(res.timings.duration);
	//     sleep(SLEEP_TIME);

	//     //========================↓    NEW SCENARIO BELOW    ↓=================================//

	//     const params2 = {
	//         headers: {
	//             'X-Requested-With': 'XMLHttpRequest',
	//             'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
	//             'cookie': `form_key=${form_key};`
	//         },
	//         redirects: 0,
	//     };

	//     res = http.post(remove_from_cart_url,
	//         `product=${product}&uenc=${uenc}&form_key=${form_key}`,
	//         params2, { follow: false});

	//     // checkRes = check(res, {
	//     //     "Remove from cart status": (r) => r.status === 302
	//     // });
	//     checkRes = check(res, {
	//         "Remove from cart assert": (r) => r.body.includes("Your session has expired!") === false
	//     });
	//     REMOVEcart.add(res.timings.duration);
	//     sleep(SLEEP_TIME);

	//     //========================↓    NEW SCENARIO BELOW    ↓=================================//

	//     res = http.get(`${cart_url}`);
	//     checkRes = check(res, {
	//         "Cart page assert": (r) => r.body.includes(`${test_cart_page_text}`) === true
	//     });
	//     checkRes += check(res, {
	//         "Cart page status 200": (r) => r.status === 200
	//     });
	//     VIEWcart.add(res.timings.duration);
	//     sleep(SLEEP_TIME);
	// });
}
