# AWS API

This library acts as a wrapper for the AWS services.

## CloudSearch

Wrapper for the `CloudSearchDomain` API.

### Usage
```javascript
// Defaults to an `CLOUDSEARCH_ENDPOINT` environment variable, but you can pass in an endpoint of your own
var cloudsearch = require('aws-util').cloudsearch({ endpoint: 'my.cloudsearch.endpoint' });
```

#### cloudsearch.publish(indexes, callback)

`indexes`: is an array of objects, [formatted](http://docs.aws.amazon.com/cloudsearch/latest/developerguide/preparing-data.html) to the structure required by `CloudSearch`

`callback`: is a function container `err` and `result` data.

```javascript
var indexes = [
    { type: 'delete', id: 'item1' },
    { type: 'delete', id: 'item2' }
];

cloudsearch.publish(indexes, function onPublish(err, result) {
    // err: error object
    // result: contains meta information. (adds, deletes, status)
});
```
---

## SNS (Simple Notification System)

Wrapper for the `SNS` API.

### Usage

```javascript
// Defaults to an `SNS_TOPIC` environment variable, but you can pass in a topic of your own
var sns = require('aws-util').sns({ topic: 'mytopic' });
```

#### sns.sendNotification(params, callback)

`params`: is an object literal container 2 or 3 properties
   - `message`: for the body of the notification.
    
   - `subject`: for the subject if sending an email.
    
   - `data`: an object literal. if sending any json data which will be stringified and appended to the message.

`callback`: is a function container `err` and `result` data.

```javascript
var params = {
    message: 'My notification message', /* required */
    subject: 'A subject for my notification', /* required */
    data: { item: item1.id }
};

sns.sendNotification(params, function onSend(err, result) {
    // err: error object
    // result: contains a message id
});
```
---

## S3

Wrapper for the `S3` API.

### Usage

```javascript
// Defaults to an `S3_BUCKET` environment variable, but you can pass in a bucket of your own
var s3 = require('aws-util').s3({ bucket: 'mybucket' });
```

#### s3.fetch(resource, settings, callback)

`resource`: path to the s3 object to be fetched.

`settings`: object literal specifying how to return the data.
   - `toString`: set to true or false, if you want the object returned from S3 to be parsed as a string.
    
   - `toJson`: set to true or false, if you want the object returned from S3 to be parsed as JSON.
    
`callback`: is a function container `err` and `result` data.

```javascript
s3.fetch('path/to/resource.json', { toString: true, toJson: true }, function onFetch(err, result) {
    // err: error object
    // result: contains the object returned from S3
});
```

#### s3.fetchJson(resource, callback)

A `s3.fetch` facade returning the object as JSON

```javascript
s3.fetchJson('path/to/resource.json', function onFetch(err, result) {
    // err: error object
    // result: contains the file JSON stringified
});
```

#### s3.save(resource, data, callback)

`resource`: path to the destination of the saved s3 object.

`data`: any data to be saved to S3. The data will be `JSON.stringified` on save.

`callback`: is a function container `err` and `result` data.

```javascript
s3.save('path/to/resource.json', { 'id': 'item1' }, function onFetch(err, result) {
    // err: error object
    // result: contains the ETag of the save process
});
```

#### s3.delete(objects, callback)

`objects`: an array of objects to be removed from an S3 resource.

`callback`: is a function container `err` and `result` data.

```javascript
// Capital 'K' required for Key
var objects = [
    { Key: 'path/to/resource1.json' },
    { Key: 'path/to/resource2.json' }
];

s3.delete(objects, function onFetch(err, result) {
    // err: error object
    // result: contains meta data on total deleted and errors 
});
```

#### s3.listObjects(settings, callback)

`settings`: an object literal specifying parameters for listing.
   - `prefix`: string used as the location for listing.
   - `marker`: string referring to the last object in the list. An empty marker represents the beginning.
   - `maxKeys`: maximum number of objects to return in a listing.

`callback`: is a function container `err` and `result` data.

```javascript
// Capital 'K' required for Key
var settings = {
    prefix: 's3/folder/',
    marker: 'start/from/file1.json',
    maxKeys: 500
};

s3.listObjects(settings, function onList(err, result) {
    // err: error object
    // result: contains information about the listing. (NextMarker, IsTruncated, Contents, etc.)
});
```

#### s3.decrypt(resource, settings, callback)

`resource`: path to the s3 object to be decrypted.

`settings`: object literal specifying how to return the data.
   - `toString`: set to true or false, if you want the object returned from S3 to be parsed as a string.
    
   - `toJson`: set to true or false, if you want the object returned from S3 to be parsed as JSON.
    
`callback`: is a function container `err` and `result` data.

```javascript
// If a file, set `toString` to false
s3.decrypt('path/to/private.file', { toString: false }, function onList(err, result) {
    // err: error object
    // result: contains decrypted data
});
```