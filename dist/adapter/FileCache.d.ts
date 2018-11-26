/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
import MemoryCache from './MemoryCache';
import CacheOpts from '../model/CacheOpts';
/**
* Implements AbstractCache
* and uses the local filesystem
* to cache keys
*/
export default class FileCache extends MemoryCache {
    setup(opts?: CacheOpts): any;
}
