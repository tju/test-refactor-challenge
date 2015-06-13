/*global beforeEach, describe, it, console */

describe('Shopping cart', function () {
	'use strict';
	var browser,
			asyncFail = this.asyncFail,
			createdItemId;
	beforeEach(function (done) {
		browser = new this.Browser();
		browser.visit('/log-in').then(function () {
			browser.fill('name', 'admin').fill('password', 'admin').pressButton('#log-in').then(done);
		});
	});
	it('creates an account', function (done) {
		browser.visit('/util/account').then(function () {
			browser.fill('name', 'test-user').fill('amount', 1000).pressButton('#set-up-account').
				then(function () {
					browser.visit('/util/account/test-user').then(function () {
						browser.assert.success();
						browser.assert.text('#balance', '1000');
						browser.assert.text('#name', 'test-user');
					}).catch(asyncFail).then(done);
				});
		});
	});
	it('creates an item', function (done) {
		browser.visit('/util/item').then(function () {
			browser.fill('name', 'blue book').fill('price', 505).fill('description', 'some desc').pressButton('#set-up-item').
				then(function () {
					browser.assert.success();
					browser.assert.text('#price', '505');
					browser.assert.text('#description', 'some desc');
					browser.assert.text('#name', 'blue book');
				}).catch(asyncFail).then(done);
		});
	});
	describe('adding to cart', function () {
		beforeEach(function (done) {
			browser.visit('/util/account').then(function () {
				browser.fill('name', 'test-user').fill('amount', 1000).pressButton('#set-up-account').then(function () {
					browser.visit('/util/item').then(function () {
						browser.fill('name', 'blue book').fill('price', 505).fill('description', 'some desc').pressButton('#set-up-item').
						then(function () {
							createdItemId = browser.text('#item-id');
							console.log('created item ' + createdItemId);
							console.log('logging in as test-user');
							browser.visit('/log-in').then(function () {
								browser.fill('name', 'test-user').fill('password', 'test-user').pressButton('#log-in').then(done);
							});
						});
					});
				});
			});
		});
		it('can add one item to cart', function (done) {
			browser.visit('/item/' + createdItemId).then(function () {
				console.log('viewing item ' + createdItemId);
				browser.assert.success();
				browser.assert.text('#item-id', createdItemId);
				browser.pressButton('#add-to-cart').
					then(function () {
						browser.assert.success();
						browser.assert.text('#totalPrice', 505);
						done();
					}).catch(asyncFail);
			});
		});
		it('can add two items to cart', function (done) {
			browser.visit('/item/' + createdItemId).then(function () {
				browser.assert.text('#item-id', createdItemId);
				browser.pressButton('#add-to-cart').
					then(function () {
						browser.visit('/item/' + createdItemId).then(function () {
							browser.assert.text('#item-id', createdItemId);
							browser.pressButton('#add-to-cart').then(function () {
								browser.assert.success();
								browser.assert.text('#totalPrice', 1010);
								done();
							});
						});
					}).catch(asyncFail);
			});
		});
		it('can check out with one item', function (done) {
			browser.visit('/item/' + createdItemId).then(function () {
				browser.assert.success();
				browser.assert.text('#item-id', createdItemId);
				browser.pressButton('#add-to-cart').
					then(function () {
						browser.pressButton('#check-out').then(function () {
							browser.assert.success();
							browser.assert.text('#totalPrice', 505);
							browser.assert.text('#numItems', 1);
							done();
						});
					}).catch(asyncFail);
			});
		});
		it('can not check out with one item', function (done) {
			browser.visit('/item/' + createdItemId).then(function () {
				browser.assert.success();
				browser.assert.text('#item-id', createdItemId);
				browser.pressButton('#add-to-cart').
					then(function () {
						browser.visit('/item/' + createdItemId).then(function () {
							browser.pressButton('#add-to-cart').then(function () {
								browser.pressButton('#check-out').then(function () {
									browser.assert.success();
									browser.assert.text('#message', 'not enough money in account');
									done();
								});
							});
						});
					}).catch(asyncFail);
			});
		});
	});
});
