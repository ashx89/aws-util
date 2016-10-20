var config = {
    topic: 'topic'
};

var sns = require('../').sns(config);

sns.sendNotification({
    message: 'Hello World',
    subject: 'Example'
}, function onPublish(err, result) {
    console.log('Error:', err);
    console.log('Result', result);
});
