/*global require, console, __dirname*/
(function () {
	'use strict';
	var express = require('express'),
			session = require('express-session'),
			uuid = require('node-uuid'),
			templateEngine  = require('express-handlebars').create({
					defaultLayout: 'main',
					extname: '.hbs',
					layoutsDir: __dirname + '/views/layouts',
					partialsDir: __dirname + '/views/partials',
					helpers: {
						timestamp: function () {
							return new Date();
						}
					}
				}).engine,
			bodyParser = require('body-parser'),
			app = express(),
			server,
			accountRepository = function (req) {
				return (req.session.accounts = req.session.accounts || {});
			},
			itemRepository = function (req) {
				return (req.session.items = req.session.items || {});
			},
			cartRepository = function (req) {
				return (req.session.cart = req.session.cart || []);
			},
			currentAccount = function (req) {
				return req.session.loggedInAccount;
			},
			requireAdmin = function (req, res, next) {
				if (req.session && req.session.admin) {
					next();
				} else {
					res.render('log-in', {error: 'Admin access required'});
				}
			};

	app.engine('.hbs', templateEngine);
	app.set('view engine', '.hbs');
	app.set('views', __dirname + '/views');
	app.use(session({secret: 'cookiesecret', resave: false, saveUninitialized: true}));
	app.use(express.static(__dirname + '/public'));
	app.all('/util/*', requireAdmin);
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(function (req, res, next) {
		if (req.session.admin) {
			res.locals.currentAccount = 'admin';
		} else {
			res.locals.currentAccount = req.session && req.session.loggedInAccount;
		}
		next();
	});

	app.get('/smoke', function (req, res) {
		res.send('Test Server running happily ' + new Date());
	});
	app.get('/', function (req, res) {
		res.render('home', {items: itemRepository(req)});
	});

	/* account management */
	app.post('/util/account', function (req, res) {
		var name = req.body.name,
				balance = req.body.amount,
				accounts = accountRepository(req);
		accounts[name] = balance;
		console.log('post account', name);
		res.render('account', { name: name, balance: balance });
	});
	app.get('/util/account', function (req, res) {
		res.render('account-setup');
	});
	app.get('/util/account/:name', function (req, res) {
		var name = req.params.name;
		res.render('account', {name: name, balance: accountRepository(req)[name]});
	});
	/* item management */
	app.post('/util/item', function (req, res) {
		var name = req.body.name,
				price = req.body.price,
				description = req.body.description,
				items = itemRepository(req),
				itemId = uuid.v4();
		items[itemId] = {name: name, description: description, price: price, id: itemId};
		console.log('post item', name, itemId);
		res.render('item', items[itemId]);
	});
	app.get('/util/item', function (req, res) {
		res.render('item-setup');
	});
	app.get('/item/:id', function (req, res) {
		var id = req.params.id;
		res.render('item', itemRepository(req)[id]);
	});
	/* logging in */
	app.post('/log-in', function (req, res) {
		var name = req.body.name,
				password = req.body.password;
		if (name === 'admin' && password === 'admin') {
			req.session.admin = true;
			req.session.loggedInAccount = false;
			res.render('log-in', {name: 'admin'});
		} else if (name === password && accountRepository(req)[name]) {
			req.session.admin = false;
			req.session.loggedInAccount = name;
			res.render('log-in', {name: name, balance: accountRepository(req)[name]});
		} else {
			res.render('log-in', {error: 'Wrong password'});
		}
	});
	app.post('/log-out', function (req, res) {
		req.session.admin = false;
		cartRepository(req).splice(0);
		req.session.loggedInAccount = false;
		res.redirect('/log-in');
	});
	app.get('/log-in', function (req, res) {
		res.render('log-in');
	});

	/* shopping card management */
	app.post('/shopping-cart', function (req, res) {
		var itemId = req.body.itemId,
				cart = cartRepository(req);
		cart.push(itemId);
		console.log('post shopping cart', itemId);
		res.redirect('/shopping-cart');
	});
	app.post('/shopping-cart/clear', function (req, res) {
		var cart = cartRepository(req);
		cart.splice(0);
		console.log('clear shopping cart');
		res.redirect('/shopping-cart');
	});
	app.post('/shopping-cart/check-out', function (req, res) {
		var cart = cartRepository(req),
				itemById = function (id) {
					return itemRepository(req)[id];
				},
				items = cartRepository(req).map(itemById),
				totalPrice = items.reduce(function (subtotal, item) {
					return subtotal + (parseFloat(item.price) || 0);
				}, 0),
				accounts = accountRepository(req),
				accountName = currentAccount(req);
		if (!cart.length) {
			res.render('checkout-request', {error: 'your cart is empty'});
		} else if (!accountName) {
			res.render('checkout-request', {error: 'not logged in'});
		} else if (accounts[accountName] < totalPrice) {
			res.render('checkout-request', {error: 'not enough money in account'});
		} else {
			accounts[accountName] -= totalPrice;
			cart.splice(0);
			res.render('checkout-request', {totalPrice: totalPrice, numItems: items.length});
		}
	});
	app.get('/shopping-cart', function (req, res) {
		var itemById = function (id) {
			return itemRepository(req)[id];
		},
		items = cartRepository(req).map(itemById),
		totalPrice = items.reduce(function (subtotal, item) {
			return subtotal + (parseFloat(item.price) || 0);
		}, 0);
		console.log(cartRepository(req), items);
		res.render('shopping-cart', {items: items, totalPrice: totalPrice});
	});

	server = app.listen(3000, function () {
		var host = server.address().address,
				port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});
})();
