Integration test cleanup example
--------------------------------

## Installing

To install the exercise, you'll need node and npm. Run 

    npm install

to get all the dependencies. 

## Verifying the installation

Verify that the server is running OK by starting

    npm start

and open http://localhost:3000/smoke in a browser. It should display a message with the current timestamp.

Keep the server running, and verify that the tests can run OK by running

    npm test -- --filter=smoke

This should print a few green dots and a message 'logged in as admin'

## Documentation on APIs used

* [Zombie JS](https://github.com/assaf/zombie/tree/62e88e1c64640c0c379cf5492321713dda0c3b2b) - note that version 3.1.1 is used for compatibility with older Node JS versions
* [Express JS](http://expressjs.com/4x/api.html) 
* [Handlebars JS](http://handlebarsjs.com/)
* [Jasmine](http://jasmine.github.io/2.3/introduction.html)
