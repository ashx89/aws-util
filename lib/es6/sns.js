const Interface = require('./interface');

/**
 * @class
 * @param {object} options
 */
class SNSInterface extends Interface {
	constructor(options) {
		super(options);

		this.snsOptions = {
			TopicArn: options.topic || process.env.SNS_TOPIC || ''
		};

		this.sns = new this.sdk.SNS();
	}

	/**
	 * Return SNS TopicArn
	 */
	getTopic() {
		return this.snsOptions.TopicArn;
	}

	/**
	 * Publish SNS notification
	 * @param {object} options
	 * @param {function} callback
	 */
	sendNotification(options, callback) {
		const params = {
			TopicArn: this.snsOptions.TopicArn,
			Subject: options.subject || '',
			Message: 'options.message\n\n' + ((options.data) ? JSON.stringify(options.data) : '') || ''
		};

		this.sns.publish(params, callback);
	}
}

module.exports = (options) => new SNSInterface(options);
