"use strict";
/**
 * @author "Fabio Cigliano"
 * @created 2/06/2020
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = __importDefault(require("lodash"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const AbstractCache_1 = __importDefault(require("../model/AbstractCache"));
const Logger_1 = __importDefault(require("../model/Logger"));
const ttl_1 = require("../ttl");
const TAG = '[lib/cache/s3]';
/**
* Implements AbstractCache
* and uses the local filesystem
* to cache keys
*/
class S3Cache extends AbstractCache_1.default {
    setup(opts) {
        const self = this;
        if (this.cache) {
            return bluebird_1.default.resolve(self);
        }
        // https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html#envvars-set
        if (lodash_1.default.has(process, 'env.AWS_ACCESS_KEY_ID') && lodash_1.default.has(process, 'env.AWS_SECRET_ACCESS_KEY') && lodash_1.default.has(opts, 's3BucketName')) {
            this.client = new aws_sdk_1.default.S3();
            // @ts-ignore
            this.bucketName = opts.s3BucketName || 'cache';
            return bluebird_1.default.resolve(self);
        }
        // test if opts contains the S3 access key
        if (!lodash_1.default.has(opts, 's3AccessKey') || !lodash_1.default.has(opts, 's3SecretKey') && !lodash_1.default.has(opts, 's3BucketName')) {
            const err = new Error('missing AWS S3 credentials');
            return bluebird_1.default.reject(err);
        }
        Logger_1.default().debug(`${TAG} setup`, opts);
        this.client = new aws_sdk_1.default.S3({
            // @ts-ignore
            accessKeyId: opts.s3AccessKey,
            // @ts-ignore
            secretAccessKey: opts.s3SecretKey,
            // @ts-ignore
            region: opts.s3Region,
        });
        // @ts-ignore
        this.bucketName = opts.s3BucketName || 'cache';
        return bluebird_1.default.resolve(self);
    }
    close() {
        return bluebird_1.default.resolve(true);
    }
    set(key, value, ttl) {
        // @ts-ignore
        return this.client.putObject({
            Bucket: this.bucketName,
            Key: key,
            Body: JSON.stringify({
                expiry: (new Date()).getTime() + (ttl || ttl_1.DEFAULT_TTL) * 1000,
                value,
            }),
        }).promise();
    }
    get(key) {
        // @ts-ignore
        return this.client.getObject({
            Bucket: this.bucketName,
            Key: key,
        }).promise().then((response) => {
            // @ts-ignore
            const content = response.Body.toString('utf-8') || '';
            const object = JSON.parse(content);
            if (object.expiry <= (new Date()).getTime()) {
                return null;
            }
            return object.value;
        })
            .catch((err) => null);
    }
    forget(key) {
        // @ts-ignore
        return this.client.deleteObject({
            Bucket: this.bucketName,
            Key: key,
        })
            .promise()
            .catch((err) => null)
            .then(() => true);
    }
}
exports.default = S3Cache;
//# sourceMappingURL=S3Cache.js.map