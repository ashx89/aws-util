var AWS = require('aws-sdk');
var proxy = require('./proxy');

var AWS_REGION = 'eu-west-1';

var HTTP_TIMEOUT = 120000;

/**
 * Check if string has been JSON.stringified
 * @private
 * @param {string} string
 */
function isJson(string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * @private
 * @constructor
 * @param {object} options
 */
function CloudSearchInterface(options) {
    var awsOptions = {
        region: AWS_REGION,
        sslEnabled: true,
        httpOptions: {
            timeout: HTTP_TIMEOUT
        }
    };

    var sdk = (options.aws) ? options.aws : AWS;

    awsOptions.httpOptions.agent = (options.agent) ? options.agent : proxy.httpsAgent();

    sdk.config.update(awsOptions);

    this.csOptions = {
        endpoint: options.endpoint || process.env.CLOUDSEARCH_ENDPOINT || ''
    };

    this.cloudsearch = new sdk.CloudSearchDomain(this.csOptions);
}

/**
 * Return CloudSearch Endpoint
 */
CloudSearchInterface.prototype.getEndpoint = function onGetEndpoint() {
    return this.csOptions.endpoint;
};

/**
 * @param {array} indexes
 * @param {function} callback
 * Publish indexes to CloudSearch
 */
CloudSearchInterface.prototype.publish = function onPublish(indexes, callback) {
    var params = {
        contentType: 'application/json',
        documents: isJson(indexes) ? indexes : JSON.stringify(indexes)
    };

    this.cloudsearch.uploadDocuments(params, function onUpload(err, result) {
        return callback(err, result);
    });
};

/**
 * @param {string} query
 * @param {function} callback
 * Do a search on CloudSearch
 */
CloudSearchInterface.prototype.search = function onSearch(query, callback) {
    this.cloudsearch.search({ query: query }, function onSearchResults(err, results) {
        return callback(err, results);
    });
};

/**
 * Constructs a configured csInstance
 * @param {object} options
 */
module.exports = function onExports(options) {
    var config = options || {};

    var csInstance = new CloudSearchInterface(config);

    return csInstance;
};