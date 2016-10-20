
var s3watch = require('../').s3watch;
var conf = require('../test.conf.json');

var watcher = s3watch(conf.bucketName, conf.objectKey, { interval: 5000 });

watcher.on('errored', function onErrored(err) {
    console.log('Event fired: `errored`', err);
});

watcher.read(); // oops

watcher.on('initialised', function onIntitialised() {
    console.log('Event fired: `initialised`');
});

watcher.on('updated', function onUpdated(data) {
    console.log('Event fired: `updated`', data);
    console.log('Read returned data from S3:', watcher.read());
    console.log('Read value of key `testData` from S3:', watcher.read('testData'));
});

watcher.on('stopped', function onStopped() {
    console.log('Event fired: `stopped`');
});

watcher.watch();

setTimeout(watcher.stop, 20000);
