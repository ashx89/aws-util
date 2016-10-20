var AWS = require('aws-sdk');
var proxy = require('./proxy');

var AWS_REGION = 'eu-west-1';

var HTTP_TIMEOUT = 120000;

/**
 * @private
 * @constructor
 * @param {object} options
 */
function SNSInterface(options) {
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

    this.snsOptions = {
        TopicArn: options.topic || process.env.SNS_TOPIC || ''
    };

    this.sns = new sdk.SNS();
}

/**
 * Return SNS TopicArn
 */
SNSInterface.prototype.getTopic = function onGetTopic() {
    return this.snsOptions.TopicArn;
};

/**
 * @param {function(err, result)} callback
 * Publish SNS notification
 */
SNSInterface.prototype.sendNotification = function onSend(options, callback) {
    var params = {
        TopicArn: this.snsOptions.TopicArn,
        Subject: options.subject || '',
        Message: options.message + '\n\n' + ((options.data) ? JSON.stringify(options.data) : '') || ''
    };

    this.sns.publish(params, function onPublish(err, result) {
        return callback(err, result);
    });
};

/**
 * Constructs a configured snsInstance
 * @param {object} options
 */
module.exports = function onExports(options) {
    var config = options || {};

    var snsInstance = new SNSInterface(config);

    return snsInstance;
};