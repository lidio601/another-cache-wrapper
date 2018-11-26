/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 * @link https://www.npmjs.com/package/iron-cache
 */
import Promise from 'bluebird';
import AbstractCache from '../model/AbstractCache';
import CacheOpts from '../model/CacheOpts';
/**
* Implements AbstractCache
* and uses IronCache
*/
export default class IronCache extends AbstractCache {
    private name;
    setup(opts?: CacheOpts): any;
    close(): Promise<boolean>;
    set(key: any, value: any, ttl?: number): any;
    get(key: any): any;
    add(key: any, value: any, ttl?: number): any;
    forget(key: any): any;
}
