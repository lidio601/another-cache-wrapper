/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
import Promise from 'bluebird';
import AbstractCache from '../model/AbstractCache';
import CacheOpts from '../model/CacheOpts';
/**
* Implements AbstractCache
* and uses the runtime memory
* to cache keys
*/
export default class MemoryCache extends AbstractCache {
    setup(opts?: CacheOpts): any;
    close(): Promise<boolean>;
    set(key: any, value: any, ttl?: number): any;
    get(key: any): any;
    forget(key: any): any;
}
