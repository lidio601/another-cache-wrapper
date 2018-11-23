/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
import Promise from 'bluebird';
import AbstractCache from './model/AbstractCache';
import CacheOpts from './model/CacheOpts';
export declare const DEFAULT_TTL = 60;
export declare const SHORT_TTL = 600;
export declare const MEDIUM_TTL = 1800;
export declare const LONG_TTL = 20;
export declare const LOCK_TTL = 20;
export default function cache(opts?: CacheOpts): Promise<AbstractCache>;
export declare function cacheKey(key: any, prefixes?: string[] | string): string;
