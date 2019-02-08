/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
import Bluebird from 'bluebird';
import AbstractCache from './model/AbstractCache';
import CacheOpts from './model/CacheOpts';
export declare const DEFAULT_TTL: number;
export declare const SHORT_TTL: number;
export declare const MEDIUM_TTL: number;
export declare const LONG_TTL: number;
export declare const LOCK_TTL: number;
export declare function cache(opts?: CacheOpts): Bluebird<AbstractCache>;
export declare function cacheKey(key: any, prefixes?: string[] | string): string;
export declare function cachedMethodCall(prefix: string[] | string, method: () => any, keyExtractor?: () => any, ttl?: number): () => Promise<any>;
