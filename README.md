Integration test cleanup example
--------------------------------

## Installing

To install the exercise, you'll need node and npm. Run 

    npm install

to get all the dependencies. 

## Verifying the installation

Verify that the server is running OK by starting

    sh server.sh

and open http://localhost:3000/smoke in a browser. It should display a message with the current timestamp.

Keep the server running, and verify that the tests can run OK by running

    sh run-tests.sh --filter=smoke

This should print a few green dots and a message 'logged in as admin'

