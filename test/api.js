/* global define describe, xdescribe, it, xit, before, after */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rumor = require('rumor')('test:api');
const axios = require('axios');
const store = require('../store')('localhost:27017/mugs-unit-api');
const api = require('../api');
const server = require('../server');

const should = chai.should(); // eslint-disable-line

chai.use(chaiAsPromised);

describe('api', function () {
	let serverInstance;

	before(() =>
		store.reset().then(() => {
			serverInstance = server(api(store, { secret: 'ssh' }));
		})
	);

	const client = axios.create({
		baseURL: 'http://localhost:3000',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const getData = data => data.data;

	describe('/', function() {
		it('should return ok', function() {
			return client
				.get('/')
				.then(getData)
				.should.eventually.have.property('code', 200);
		});
	});

	describe('/register', function() {
		it('should allow a registration', function() {
			return client
				.post('/register', { email: 'parkov' })
				.then(getData)
				.should.eventually.have.property('code', 200);
		});
	});

	after(() => {
		serverInstance.close();
	});
});
