var config = {
    endpoint: 'http://search.aws.com/cloudsearch-endpoint'
};

var cloudsearch = require('../').cloudsearch(config);

var indexes = [{ type: 'delete', id: '123' }];

cloudsearch.publish(indexes, function onPublish(err, result) {
    console.log('Error:', err);
    console.log('Result', result);
});
