var tap = require('tap');
var mockAws = require('mock-aws');
var config = require('../test.conf.json').sns;

config.aws = mockAws;

var sns = require('../').sns(config);

tap.test('sns has options configured', function (t) {
    t.plan(1);
    t.true(Object.keys(sns.snsOptions).length);
    t.end();
});

tap.test('sns options are retrievable', function (t) {
    t.plan(1);
    t.true(sns.getTopic());
    t.end();
});

tap.test('sns should publish to topic', function (t) {
    t.plan(2);

    mockAws.mock('SNS', 'publish', function onPublish(params, callback) {
        callback(null, {
            Records: [{
                Sns: [],
                EventSource: 'mock-aws:sns',
                EventVersion: '1.0',
                EventSubscriptionArn: 'arn:aws:sns:eu-west-1:0000000000:TopicName:00000000-1111-2222-3333-444444444444'
            }]
        });
    });

    var params = {
        message: 'This is a message',
        subject: 'This is a subject',
        data: { hello: 'world' }
    };

    sns.sendNotification(params, function onSend(err, result) {
        t.false(err);
        t.true(result);
        t.end();
    });
});
