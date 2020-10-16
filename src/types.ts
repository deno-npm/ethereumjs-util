import {
  BN
} from '../deps.js';
import { unpadBuffer } from './bytes.js'

/*
 * A type that represents a BNLike input that can be converted to a BN.
 */
export type BNLike = BN | string | number

/*
 * A type that represents a BufferLike input that can be converted to a Buffer.
 */
export type BufferLike =
  | Buffer
  | Uint8Array
  | number[]
  | number
  | BN
  | TransformableToBuffer
  | PrefixedHexString

/*
 * A type that represents a `0x`-prefixed hex string.
 */
export type PrefixedHexString = string

/*
 * A type that represents an object that has a `toArray()` method.
 */
export interface TransformableToArray {
  toArray(): Uint8Array
  toBuffer?(): Buffer
}

/*
 * A type that represents an object that has a `toBuffer()` method.
 */
export interface TransformableToBuffer {
  toBuffer(): Buffer
  toArray?(): Uint8Array
}

/**
 * Convert value from BN to RLP (unpadded buffer)
 * @param value value to convert
 */
export function bnToRlp(value: BN): Buffer {
  // Using `bn.toArrayLike(Buffer)` instead of `bn.toBuffer()`
  // for compatibility with browserify and similar tools
  return unpadBuffer(value.toArrayLike(Buffer))
}
