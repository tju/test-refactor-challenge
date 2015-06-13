/*global require, console, __dirname*/
(function () {
	'use strict';
	var express = require('express'),
			session = require('express-session'),
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
			server;

	app.engine('.hbs', templateEngine);
	app.set('view engine', '.hbs');
	app.set('views', __dirname + '/views');
	app.use(session({secret: 'cookiesecret', resave: false, saveUninitialized: true}));
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser.urlencoded({ extended: false }));

	app.get('/', function (req, res) {
		res.send('Test Server running happily ' + new Date());
	});

	app.post('/util/account', function (req, res) {
		var name = req.body.name,
				balance = req.body.amount,
				accounts = (req.session.accounts = req.session.accounts || {});
		accounts[name] = balance;
		console.log('post', accounts);
		res.render('account', { name: name, balance: balance });
	});
	app.get('/util/account', function (req, res) {
		res.render('account-setup');
	});
	app.get('/util/account/:name', function (req, res) {
		var name = req.params.name,
				accounts = (req.session.accounts = req.session.accounts || {}),
				balance = accounts[name];
		res.render('account', { name: name, balance: balance });
	});
	server = app.listen(3000, function () {
		var host = server.address().address,
				port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});
})();
