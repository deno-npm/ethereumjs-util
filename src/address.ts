import { BN, Buffer } from "../deps.js";
import { toBuffer, zeros } from "./bytes.ts";
import {
  generateAddress,
  generateAddress2,
  isValidAddress,
  privateToAddress,
  pubToAddress,
} from "./account.ts";

export class Address {
  public readonly buf: Buffer;

  constructor(buf: Buffer) {
    if (buf.length !== 20) {
      throw new Error("Invalid address length");
    }
    this.buf = buf;
  }

  /**
   * Returns the zero address.
   */
  static zero(): Address {
    return new Address(zeros(20));
  }

  /**
   * Returns an Address object from a hex-encoded string.
   * @param str - Hex-encoded address
   */
  static fromString(str: string): Address {
    if (!isValidAddress(str)) {
      throw new Error("Invalid address");
    }
    return new Address(toBuffer(str));
  }

  /**
   * Returns an address for a given public key.
   * @param pubKey The two points of an uncompressed key
   */
  static fromPublicKey(pubKey: Buffer): Address {
    if (!Buffer.isBuffer(pubKey)) {
      throw new Error("Public key should be Buffer");
    }
    const buf = pubToAddress(pubKey);
    return new Address(buf);
  }

  /**
   * Returns an address for a given private key.
   * @param privateKey A private key must be 256 bits wide
   */
  static fromPrivateKey(privateKey: Buffer): Address {
    if (!Buffer.isBuffer(privateKey)) {
      throw new Error("Private key should be Buffer");
    }
    const buf = privateToAddress(privateKey);
    return new Address(buf);
  }

  /**
   * Generates an address for a newly created contract.
   * @param from The address which is creating this new address
   * @param nonce The nonce of the from account
   */
  static generate(from: Address, nonce: BN): Address {
    if (!BN.isBN(nonce)) {
      throw new Error();
    }
    return new Address(generateAddress(from.buf, nonce.toArrayLike(Buffer)));
  }

  /**
   * Generates an address for a contract created using CREATE2.
   * @param from The address which is creating this new address
   * @param salt A salt
   * @param initCode The init code of the contract being created
   */
  static generate2(from: Address, salt: Buffer, initCode: Buffer): Address {
    if (!Buffer.isBuffer(salt) || !Buffer.isBuffer(initCode)) {
      throw new Error();
    }
    return new Address(generateAddress2(from.buf, salt, initCode));
  }

  /**
   * Is address zero.
   */
  isZero(): boolean {
    return this.buf.equals(Address.zero().buf);
  }

  /**
   * Returns hex encoding of address.
   */
  toString(): string {
    return "0x" + this.buf.toString("hex");
  }

  /**
   * Returns Buffer representation of address.
   */
  toBuffer(): Buffer {
    return Buffer.from(this.buf);
  }
}
