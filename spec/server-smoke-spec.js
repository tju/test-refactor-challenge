/*global beforeEach, describe, it */

describe('Server smoke test', function () {
	'use strict';
	var browser;

	beforeEach(function (done) {
		browser = new this.Browser();
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
				browser.assert.text('#name', 'gojko1');
			}).catch(this.asyncFail).then(done);
		});
	});
});
