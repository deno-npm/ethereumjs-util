import {
  BN,
  rlp,
  util,
} from "./deps.js";

/**
 * Constants
 */
export * from './src/constants.ts'

/**
 * Account class and helper functions
 */
export * from './src/account.ts'

/**
 * Address type
 */
export * from './src/address.ts'

/**
 * Hash functions
 */
export * from './src/hash.ts'

/**
 * ECDSA signature
 */
export * from './src/signature.ts'

/**
 * Utilities for manipulating Buffers, byte arrays, etc.
 */
export * from './src/bytes.ts'

/**
 * Function for definining properties on an object
 */
export * from './src/object.ts'

/**
 * External exports (BN, rlp)
 */
export {
  BN,
  rlp,
};

/**
 * Helpful TypeScript types
 */
export * from './src/types.ts'

const {
  arrayContainsArray,
  fromAscii,
  fromUtf8,
  getBinarySize,
  getKeys,
  intToBuffer,
  intToHex,
  isHexPrefixed,
  isHexString,
  padToEven,
  stripHexPrefix,
  toAscii,
  toUtf8,
} = util;

/**
 * Export ethjs-util methods
 */
export {
  arrayContainsArray,
  fromAscii,
  fromUtf8,
  getBinarySize,
  getKeys,
  intToBuffer,
  intToHex,
  isHexPrefixed,
  isHexString,
  padToEven,
  stripHexPrefix,
  toAscii,
  toUtf8,
};
