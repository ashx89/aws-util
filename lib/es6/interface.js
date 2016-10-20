const AWS = require('aws-sdk');
const proxy = require('../proxy');

const awsOptions = {
	region: 'eu-west-1',
	sslEnabled: true,
	httpOptions: {
		timeout: 120000
	}
};

class Interface {
	constructor(options) {
		this.sdk = (options.aws) ? options.aws : AWS;
		awsOptions.httpOptions.agent = (options.agent) ? options.agent : proxy.httpsAgent();

		this.sdk.config.update(awsOptions);
	}

	/**
	 * Check if string has been JSON.stringified
	 * @private
	 * @param {string} string
	 */
	isJson(string) {
		try { JSON.parse(string); } 
		catch (e) { return false; }

		return true;
	}
}

module.exports = Interface;
