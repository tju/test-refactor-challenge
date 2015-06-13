/*global beforeEach, describe, it, require, expect */
var Browser = require('zombie');
Browser.localhost('example.com', 3000);
describe('Server smoke test', function () {
	'use strict';
	var browser;
	beforeEach(function (done) {
		browser = new Browser();
		browser.visit('/util/account', done);
	});
	describe('account balance', function () {
		beforeEach(function (done) {
			browser.fill('name', 'gojko').fill('amount', 1000).pressButton('input[type=submit]').then(done).catch(done);
		});

		it('should set balance', function () {
			browser.assert.success();
			browser.assert.url('/util/account');
			browser.assert.text('#balance', '1000');
			browser.assert.text('#name', 'gojko');
		});
		it('should be able to query balance after setting', function (done) {
			browser.visit('/util/account/gojko').then(function () {
				browser.assert.success();
				browser.assert.text('#balance', '1000');
				browser.assert.text('#name', 'gojko');
				done();
			}).catch(function (error) {
				expect(error).toBeFalsy();
				done();
			});
		});
	});
});
