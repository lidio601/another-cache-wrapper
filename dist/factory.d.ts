/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
import Promise from 'bluebird';
import AbstractCache from './model/AbstractCache';
import CacheOpts from './model/CacheOpts';
export default function factory(opts?: CacheOpts): Promise<AbstractCache>;
