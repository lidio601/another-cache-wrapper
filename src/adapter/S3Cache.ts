/**
 * @author "Fabio Cigliano"
 * @created 2/06/2020
 */

import Promise from 'bluebird'
import _ from 'lodash'
import AWS from 'aws-sdk'

import AbstractCache from '../model/AbstractCache'
import CacheOpts from '../model/CacheOpts'
import logger from '../model/Logger'
import { DEFAULT_TTL } from '../ttl'

const TAG = '[lib/cache/s3]'

 /**
 * Implements AbstractCache
 * and uses the local filesystem
 * to cache keys
 */
export default class S3Cache extends AbstractCache {
  // @ts-ignore
  private client: AWS.S3;

  // @ts-ignore
  private bucketName: string;

  setup(opts ?: CacheOpts) {
    const self : AbstractCache = this

    if (this.cache) {
      return Promise.resolve(self)
    }

    // https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html#envvars-set
    if (_.has(process, 'env.AWS_ACCESS_KEY_ID') && _.has(process, 'env.AWS_SECRET_ACCESS_KEY') && _.has(opts, 's3BucketName')) {
      this.client = new AWS.S3()
      // @ts-ignore
      this.bucketName = opts.s3BucketName || 'cache';

      return Promise.resolve(self)
    }

    // test if opts contains the S3 access key
    if (!_.has(opts, 's3AccessKey') || !_.has(opts, 's3SecretKey') && !_.has(opts, 's3BucketName')) {
      const err = new Error('missing AWS S3 credentials')

      return Promise.reject(err)
    }

    logger().debug(`${TAG} setup`, opts)

    this.client = new AWS.S3({
        // @ts-ignore
        accessKeyId: opts.s3AccessKey,
        // @ts-ignore
        secretAccessKey: opts.s3SecretKey,
        // @ts-ignore
        region: opts.s3Region,
    });

    // @ts-ignore
    this.bucketName = opts.s3BucketName || 'cache';

    return Promise.resolve(self)
  }

  close() {
    return Promise.resolve(true);
  }

  set(key : any, value : any, ttl ?: number) : Promise<any> {
    // @ts-ignore
    return this.client.putObject({
        Bucket: this.bucketName,
        Key: key,
        Body: JSON.stringify({
            expiry: (new Date()).getTime() + (ttl || DEFAULT_TTL) * 1000,
            value,
        }),
    }).promise();
  }

  get(key : any) : Promise<null|any> {
    // @ts-ignore
    return this.client.getObject({
        Bucket: this.bucketName,
        Key: key,
    }).promise().then((response) => {
        // @ts-ignore
        const content = response.Body.toString('utf-8') || '';
        const object = JSON.parse(content);

        if ( object.expiry <= (new Date()).getTime() ) {
            return null;
        }
        
        return object.value;
    })
        .catch((err) => null);
  }

  forget(key : any) : Promise<null|any> {
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
