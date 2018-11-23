/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

export default interface CacheOpts {
  cachedir ?: string,
  memcache ?: string,
  ironcache ?: {
    name : string,
    project : string,
    secret: string
  }
}