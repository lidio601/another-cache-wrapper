/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
import Promise from 'bluebird';
import CacheOpts from './CacheOpts';
/**
 * Base class for a cache wrapper
 */
export default abstract class AbstractCache {
    protected cache: undefined | any;
    protected tag(): string;
    protected log(msg: any, arg?: any): void;
    protected error(msg: any, arg?: any | Error): void;
    /**
     * @param {CacheOpts} opts
     * @returns {Promise<AbstractCache>}
     */
    abstract setup(opts?: CacheOpts): Promise<AbstractCache>;
    /**
     * @returns {Promise<boolean>}
     */
    abstract close(): Promise<boolean>;
    /**
     * @param {any} key
     * @param {any} value
     * @param {Number} ttl
     * @returns {Promise<any>}
     */
    abstract set(key: any, value: any, ttl?: number): Promise<any>;
    /**
     * @param {any} key
     * @param {any} value
     * @param {Number} ttl
     * @returns {Promise<boolean>}
     */
    add(key: any, value: any, ttl?: number): Promise<any>;
    /**
     * @param {any} key
     * @returns {Promise<null|any>}
     */
    abstract get(key: any): Promise<null | any>;
    /**
     * @param {any} key
     * @returns {Promise<boolean>}
     */
    abstract forget(key: any): Promise<boolean>;
    lock(key: any, ttl: number): Promise<boolean>;
    unlock(key: any): Promise<boolean>;
}
