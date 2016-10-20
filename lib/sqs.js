var AWS = require('aws-sdk');
var proxy = require('./proxy');

var AWS_REGION = 'eu-west-1';

var HTTP_TIMEOUT = 120000;

/**
 * @private
 * @constructor
 * @param {object} options
 */
function SQSInterface(options) {
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

    this.SQSOptions = {
        endpoint: options.endpoint || process.env.SQS_ENDPOINT || ''
    };

    this.SQS = new sdk.SQS();
}

/**
 * Send a message to SQS Queue
 */
SQSInterface.prototype.sendMessage = function onSendMessage(options, callback) {
    var params = {
        MessageBody: options.message,
        QueueUrl: options.queueUrl || process.env.SQS_QUEUE
    };

    this.SQS.sendMessage(params, function onSend(err, result) {
        return callback(err, result);
    });
};

/**
 * Constructs a configured SQSInstance
 * @param {object} options
 */
module.exports = function onExports(options) {
    var config = options || {};

    var SQSInstance = new SQSInterface(config);

    return SQSInstance;
};