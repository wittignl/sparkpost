'use strict';

var key = 'YOURAPIKEY',
    SparkPost = require('sparkpost'),
    client = new SparkPost(key);

// Promise
client.subaccounts.get('123')
    .then(data => {

        console.log('Congrats you can use our client library!');
        console.log(data);
    })
    .catch(err => {

        console.log('Whoops! Something went wrong');
        console.log(err);
    });

// Callback
client.subaccounts.get('123', function(err, data) {

    if (err) {

        console.log('Whoops! Something went wrong');
        console.log(err);
    }
    else {

        console.log('Congrats you can use our client library!');
        console.log(data);
    }
});
