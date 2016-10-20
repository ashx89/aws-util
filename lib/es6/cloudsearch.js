const Interface = require('./interface');

/**
 * @class
 * @param {object} options
 */
class CloudSearchInterface extends Interface {
	constructor(options) {
		super(options);

		this.csOptions = {
			endpoint: options.endpoint || process.env.CLOUDSEARCH_ENDPOINT || ''
		};

		this.cloudsearch = new this.sdk.CloudSearchDomain(this.csOptions);
	}

	/**
	 * Return CloudSearch Endpoint
	 */
	getEndpoint() {
		return this.csOptions.endpoint;
	}

	/**
	 * Publish indexes to CloudSearch
	 * @param {array} indexes
	 * @param {function} callback
	 */
	publish(indexes, callback) {
		const params = {
			contentType: 'application/json',
			documents: this.isJson(indexes) ? indexes : JSON.stringify(indexes)
		};

		this.cloudsearch.uploadDocuments(params, callback);
	}

	/**
	 * Do a search on CloudSearch
	 * @param {string} query
	 * @param {function} callback
	 */
	search(query, callback) {
		this.cloudsearch.search({ query: query }, callback);
	}
}

module.exports = (options) => new CloudSearchInterface(options);
