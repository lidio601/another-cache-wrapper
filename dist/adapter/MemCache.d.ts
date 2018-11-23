/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
import Promise from 'bluebird';
import AbstractCache from '../model/AbstractCache';
import CacheOpts from '../model/CacheOpts';
/**
* Implements AbstractCache
* and uses Memcached
*/
export default class MemCache extends AbstractCache {
    tag(): string;
    setup(opts?: CacheOpts): any;
    close(): Promise<boolean>;
    set(key: any, value: any, ttl?: number): any;
    get(key: any): any;
    add(key: any, value: any, ttl?: number): any;
    forget(key: any): any;
}
