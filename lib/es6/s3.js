const Interface = require('./interface');

/**
 * @class
 * @param {object} options
 */
class S3Interface extends Interface {
	constructor(options) {
		super(options);

		this.s3Options = {
			Bucket: options.bucket || process.env.S3_BUCKET || ''
		};

		this.s3 = new this.sdk.S3(this.s3Options);
		this.kms = new this.sdk.KMS();
	}

	/**
	 * Return S3 Bucket
	 */
	getBucket() {
		return this.s3Options.Bucket;
	}

	/**
	 * List objects from S3
	 * @param {object} options - { prefix:String, marker:String, maxKeys:Number }
	 * @param {function} callback
	 */
	listObjects(options, callback) {
		const params = {
			Bucket: this.s3Options.Bucket,
			Delimiter: '/',
			Prefix: (options.prefix.substr(-1) !== '/') ?
						options.prefix += '/' :
						options.prefix,
			Marker: options.marker,
			MaxKeys: options.maxKeys
		};

		this.s3.listObjects(params, callback);
	}

	/**
	 * Fetch an object from S3
	 * @param {string} resource
	 * @param {object} options - { toString:Boolean, toJson:Boolean }
	 * @param {function} callback
	 */
	fetch(resource, options, callback) {
		const params = {
			Bucket: this.s3Options.Bucket,
			Key: resource
		};

		this.s3.getObject(params, (err, result) => {
			if (err) return callback(err, null);

			let data = (options.toString) ? result.Body.toString() : result.Body;

			if (options.toJson) data = (this.isJson(data)) ? JSON.parse(data) : data;

			return callback(err, data);
		});
	}
	/**
	 * Fetch data as JSON. (Facade)
	 * @param {string} resource
	 * @param {function} callback
	 */
	fetchJson(resource, callback) {
		this.fetch.call(this, resource, { toString: true, toJson: true }, callback);
	}

	/**
	 * Delete object from S3
	 * @param {array} objects
	 * @param {function} callback
	 */
	delete(objects, callback) {
		const params = {
			Bucket: this.s3Options.Bucket,
			Delete: {
				Objects: objects,
				Quiet: false
			}
		};

		this.s3.deleteObjects(params, callback);
	}

	/**
	 * Save object to S3
	 * @param {string} resource
	 * @param {object} data
	 * @param {function} callback
	 */
	save(resource, data, callback) {
		const params = {
			Bucket: this.s3Options.Bucket,
			Key: resource,
			Body: this.isJson(data) ? data : JSON.stringify(data)
		};

		this.s3.putObject(params, callback);
	}

	/**
	 * Decrypt object to S3
	 * @param {string} resource
	 * @param {object} options - { toString:Boolean, toJson:Boolean }
	 * @param {function} callback
	 */
	decrypt(resource, options, callback) {
		this.fetch(resource, options, (err, data) => {
			if (err) return callback(err, null);

			const params = {
				CiphertextBlob: new Buffer(data, 'base64')
			};

			this.kms.decrypt(params, (err, result) => callback(err, result.Plaintext.toString()));
		});
	}
}

module.exports = (options) => new S3Interface(options);
