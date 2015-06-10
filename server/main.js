/*global require, console, __dirname*/
(function () {
	'use strict';
	var express = require('express'),
			session = require('express-session'),
			bodyParser = require('body-parser'),
			app = express(),
			server;

	app.use(session({secret: 'cookiesecret', resave: false, saveUninitialized: true}));
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser.urlencoded({ extended: false }));

	app.get('/', function (req, res) {
		res.send('Test Server running happily ' + new Date());
	});

	app.post('/util/account', function (req, res) {
		req.session.accounts = req.session.accounts || {};
		req.session.accounts[req.body.name] = req.body.amount;
		console.log('post', req.session.accounts);
		res.send('Set up account ' + req.body.name);
	});
	app.get('/util/account/:name', function (req, res) {
		console.log('get', req.session.accounts);
		res.send('GET request for account ' + req.params.name + ' ' + req.session.accounts[req.params.name]) ;
	});

	server = app.listen(3000, function () {
		var host = server.address().address,
				port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});
})();
