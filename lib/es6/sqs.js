const Interface = require('./interface');

/**
 * @class
 * @param {object} options
 */
class SQSInterface extends Interface {
	constructor(options) {
		super(options);

		this.SQSOptions = {
			endpoint: options.endpoint || process.env.SQS_ENDPOINT || ''
		};

		this.SQS = new this.sdk.SQS();
	}

	/**
	 * Send a message to SQS Queue
	 */
	sendMessage(options, callback) {
		const params = {
			MessageBody: options.message,
			QueueUrl: options.queueUrl || process.env.SQS_QUEUE
		};

		this.SQS.sendMessage(params, callback);
	}
}

module.exports = (options) => new SQSInterface(options);
