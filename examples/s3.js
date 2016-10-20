var config = {
    bucket: 'examplebucket'
};

var s3 = require('../').s3(config);

// can also use: s3.loadFromS3(resource, options, callback) or s3.fetchJson(resource, callback)
s3.fetch('path/to/resource.json', { toString: true, toJson: true }, function onFetch(err, result) {
    console.log('Error:', err);
    console.log('Result', result);
});

s3.save('path/to/resource.json', { hello: 'world' }, function onSave(err, result) {
    console.log('Error:', err);
    console.log('Result', result);
});

s3.delete([{ Key: 'path/to/resource.json' }], function onDelete(err, result) {
    console.log('Error:', err);
    console.log('Result', result);
});

s3.listObjects([{ type: 'delete', id: '123' }], function onList(err, result) {
    console.log('Error:', err);
    console.log('Result', result);
});

s3.decrypt('path/to/resource.txt', { toString: true }, function onDecrypt(err, result) {
    console.log('Error:', err);
    console.log('Result', result);
});
