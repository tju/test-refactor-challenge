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
			};

	app.engine('.hbs', templateEngine);
	app.set('view engine', '.hbs');
	app.set('views', __dirname + '/views');
	app.use(session({secret: 'cookiesecret', resave: false, saveUninitialized: true}));
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser.urlencoded({ extended: false }));

	app.get('/smoke', function (req, res) {
		res.send('Test Server running happily ' + new Date());
	});
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
	app.get('/', function (req, res) {
		res.render('home', {items: itemRepository(req)});
	});


	server = app.listen(3000, function () {
		var host = server.address().address,
				port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});
})();
