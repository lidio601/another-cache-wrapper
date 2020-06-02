/**
 * @author "Fabio Cigliano"
 * @created 2/06/2020
 */
import Promise from 'bluebird';
import AbstractCache from '../model/AbstractCache';
import CacheOpts from '../model/CacheOpts';
/**
* Implements AbstractCache
* and uses the local filesystem
* to cache keys
*/
export default class S3Cache extends AbstractCache {
    private client;
    private bucketName;
    setup(opts?: CacheOpts): Promise<AbstractCache>;
    close(): Promise<boolean>;
    set(key: any, value: any, ttl?: number): Promise<any>;
    get(key: any): Promise<null | any>;
    forget(key: any): Promise<null | any>;
}
