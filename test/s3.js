var tap = require('tap');
var mockAws = require('mock-aws');

var config = require('../test.conf.json').s3;
config.aws = mockAws;

var s3 = require('../').s3(config);

tap.test('s3 should have a bucket', function (t) {
    t.plan(1);
    t.true(s3.getBucket());
    t.end();
});

tap.test('s3 should list objects', function (t) {
    t.plan(3);

    mockAws.mock('S3', 'listObjects', function onListObject(params, callback) {
        callback(null, {
            IsTruncated: true,
            Marker: '',
            NextMarker: 'path/to/nextmarker.json',
            Contents: [{ Key: 'file.json' }],
            Delimiter: '/',
            MaxKeys: 10
        });
    });

    var options = {
        prefix: 'path/to/folder/',
        marker: '',
        maxKeys: 10
    };

    s3.listObjects(options, function onList(err, result) {
        t.false(err);
        t.true(result);
        t.true(result.Contents.length);
        t.end();
    });
});

function isJson(string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}

tap.test('s3 should fetch an object', function (t) {
    t.plan(2);

    mockAws.mock('S3', 'getObject', function onGetObject(params, callback) {
        callback(null, {
            Body: JSON.stringify({ hello: 'world' }),// { "hello": "world" },
            ETag: 'e19ab63dc'
        });
    });

    s3.fetch('path/to/file.json', { toString: true, toJson: true }, function onFetch(err, result) {
        t.false(err);
        t.true(result);
        t.end();
    });
});

tap.test('s3 fetchJson facade should fetch an object', function (t) {
    t.plan(3);

    mockAws.mock('S3', 'getObject', function onJsonGetObject(params, callback) {
        callback(null, {
            Body: JSON.stringify({ hello: 'world' }),
            ETag: 'e19ab63dc'
        });
    });

    s3.fetchJson('path/to/file.json', function onJsonFetch(err, result) {
        t.false(err);
        t.true(result);
        t.true(result.hello);
        t.end();
    });
});

tap.test('s3 should delete an object', function (t) {
    t.plan(4);

    mockAws.mock('S3', 'deleteObjects', function onDeleteObject(params, callback) {
        callback(null, {
            Errors: [],
            Deleted: [
                { Key: 'path/to/file1.json' },
                { Key: 'path/to/file2.json' }
            ]
        });
    });

    var data = [{ Key: 'path/to/file1.json' }, { Key: 'path/to/file2.json' }];

    s3.delete(data, function onDelete(err, result) {
        t.false(err);
        t.true(result);
        t.false(result.Errors.length);
        t.true(result.Deleted.length);
        t.end();
    });
});

tap.test('s3 should save an object', function (t) {
    t.plan(2);

    mockAws.mock('S3', 'putObject', function onPutObject(params, callback) {
        callback(null, { ETag: 'e19ab63dc' });
    });

    var data = { hello: 'world' };

    s3.save('path/to/folder', data, function onSave(err, result) {
        t.false(err);
        t.true(result);
        t.end();
    });
});

/**
 * KMS not available in mockAws API
 *
 tap.test('s3 should decrypt data', function (t) {
    t.plan(2);

    mockAws.mock('KMS', 'decrypt', function onDecryptObject(params, callback) {
        callback(null, { KeyId: 'arn:aws:number', Plaintext: 'decryptedstring' });
    });

    s3.decrypt('path/to/secret/file.pm', { toString: true }, function onDecrypt(err, result) {
        t.false(err);
        t.true(result);
        t.end();
    });
 });
 */
