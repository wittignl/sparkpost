'use strict';

var key = 'YOURAPIKEY',
    SparkPost = require('sparkpost'),
    client = new SparkPost(key);

// Promise
client.webhooks.delete('TEST_WEBHOOK_UUID')
    .then(data => {

        console.log('Congrats you can use our client library!');
        console.log(data);
    })
    .catch(err => {

        console.log('Whoops! Something went wrong');
        console.log(err);
    });

// Callback
client.webhooks.delete('TEST_WEBHOOK_UUID', function(err, data) {

    if (err) {

        console.log('Whoops! Something went wrong');
        console.log(err);
    }
    else {

        console.log('Congrats you can use our client library!');
        console.log(data);
    }
});
