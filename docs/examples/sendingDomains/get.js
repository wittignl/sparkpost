'use strict';

var key = 'YOURAPIKEY',
    SparkPost = require('sparkpost'),
    client = new SparkPost(key);

// Promise
client.sendingDomains.get('example1.com')
    .then(data => {

        console.log('Congrats you can use our client library!');
        console.log(data);
    })
    .catch(err => {

        console.log('Whoops! Something went wrong');
        console.log(err);
    });

// Callback
client.sendingDomains.get('example1.com', function(err, data) {

    if (err) {

        console.log('Whoops! Something went wrong');
        console.log(err);
    }
    else {

        console.log('Congrats you can use our client library!');
        console.log(data);
    }
});
