var tap = require('tap');
var mockAws = require('mock-aws');
var config = require('../test.conf.json').cloudsearch;

config.aws = mockAws;

var cloudsearch = require('../').cloudsearch(config);

tap.test('cloudsearch has options configured', function (t) {
    t.plan(1);
    t.true(Object.keys(cloudsearch.csOptions).length);
    t.end();
});

tap.test('cloudsearch endpoint is retrievable', function (t) {
    t.plan(1);
    t.true(cloudsearch.getEndpoint());
    t.end();
});

tap.test('cloudsearch should publish', function (t) {
    t.plan(2);

    mockAws.mock('CloudSearchDomain', 'uploadDocuments', function onUpload(params, callback) {
        callback(null, {
            status: 'complete',
            adds: 1400,
            deletes: 750,
            warnings: [],
        });
    });

    var indexes = JSON.stringify([{ type: 'delete', id: '123' }]);

    cloudsearch.publish(indexes, function onPublish(err, result) {
        t.false(err);
        t.true(result);
        t.end();
    });
});
