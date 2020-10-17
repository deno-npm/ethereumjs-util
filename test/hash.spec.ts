import { assertEquals, assertThrows } from "./deps.js";
import {
  keccak,
  keccak256,
  keccakFromArray,
  keccakFromHexString,
  keccakFromString,
  ripemd160,
  ripemd160FromArray,
  ripemd160FromString,
  rlphash,
  sha256,
  sha256FromArray,
  sha256FromString,
  toBuffer,
} from "../mod.ts";

Deno.test("keccak should produce a keccak224 hash", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "9e66938bd8f32c8610444bb524630db496bd58b689f9733182df63ba";
  const hash = keccak(toBuffer(msg), 224);
  assertEquals(hash.toString("hex"), r);
});
Deno.test("keccak should produce a keccak256 hash", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28";
  const hash = keccak(toBuffer(msg));
  assertEquals(hash.toString("hex"), r);
});
Deno.test("keccak should produce a keccak384 hash", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r =
    "923e0f6a1c324a698139c3f3abbe88ac70bf2e7c02b26192c6124732555a32cef18e81ac91d5d97ce969745409c5bbc6";
  const hash = keccak(toBuffer(msg), 384);
  assertEquals(hash.toString("hex"), r);
});
Deno.test("keccak should produce a keccak512 hash", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r =
    "36fdacd0339307068e9ed191773a6f11f6f9f99016bd50f87fd529ab7c87e1385f2b7ef1ac257cc78a12dcb3e5804254c6a7b404a6484966b831eadc721c3d24";
  const hash = keccak(toBuffer(msg), 512);
  assertEquals(hash.toString("hex"), r);
});
Deno.test("keccak should error if provided incorrect bDeno.tests", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  assertThrows(function () {
    keccak(toBuffer(msg), 1024);
  });
});

Deno.test("keccak256 should produce a hash (keccak(a, 256) alias)", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28";
  const hash = keccak256(toBuffer(msg));
  assertEquals(hash.toString("hex"), r);
});

Deno.test("keccakFromString should produce a hash", function () {
  const msg =
    "3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "22ae1937ff93ec72c4d46ff3e854661e3363440acd6f6e4adf8f1a8978382251";
  const hash = keccakFromString(msg);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("keccakFromHexString should produce a hash", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28";
  const hash = keccakFromHexString(msg);
  assertEquals(hash.toString("hex"), r);
});
Deno.test("keccakFromHexString should throw if input is not hex-prefixed", function () {
  const msg =
    "3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  assertThrows(function () {
    keccakFromHexString(msg);
  });
});

Deno.test("keccakFromArray should produce a hash", function () {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0];
  const r = "fba8669bd39e3257e64752758f3a0d3218865a15757c6b0bc48b8ef95bc8bfd5";
  const hash = keccakFromArray(arr);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("keccak-512 should produce a hash", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r =
    "36fdacd0339307068e9ed191773a6f11f6f9f99016bd50f87fd529ab7c87e1385f2b7ef1ac257cc78a12dcb3e5804254c6a7b404a6484966b831eadc721c3d24";
  const hash = keccak(toBuffer(msg), 512);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("sha256 should produce a sha256", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "58bbda5e10bc11a32d808e40f9da2161a64f00b5557762a161626afe19137445";
  const hash = sha256(toBuffer(msg));
  assertEquals(hash.toString("hex"), r);
});

Deno.test("sha256FromString should produce a sha256", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "58bbda5e10bc11a32d808e40f9da2161a64f00b5557762a161626afe19137445";
  const hash = sha256FromString(msg);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("sha256FromArray should produce a sha256", function () {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0];
  const r = "5443c487d45d01c56150d91e7a071c69a97939b1c57874b73989a9ff7875e86b";
  const hash = sha256FromArray(arr);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("ripemd160 should produce a ripemd160", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "4bb0246cbfdfddbe605a374f1187204c896fabfd";
  const hash = ripemd160(toBuffer(msg), false);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("ripemd160 should produce a padded ripemd160", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "0000000000000000000000004bb0246cbfdfddbe605a374f1187204c896fabfd";
  const hash = ripemd160(toBuffer(msg), true);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("ripemd160FromString should produce a ripemd160", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "4bb0246cbfdfddbe605a374f1187204c896fabfd";
  const hash = ripemd160FromString(msg, false);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("ripemd160FromString should produce a padded ripemd160", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "0000000000000000000000004bb0246cbfdfddbe605a374f1187204c896fabfd";
  const hash = ripemd160FromString(msg, true);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("ripemd160FromArray should produce a ripemd160", function () {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0];
  const r = "ddbb5062318b209e3dbfc389fe61840363050071";
  const hash = ripemd160FromArray(arr, false);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("ripemd160FromArray should produce a padded ripemd160", function () {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0];
  const r = "000000000000000000000000ddbb5062318b209e3dbfc389fe61840363050071";
  const hash = ripemd160FromArray(arr, true);
  assertEquals(hash.toString("hex"), r);
});

Deno.test("rlphash should produce a keccak-256 hash of the rlp data", function () {
  const msg =
    "0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const r = "33f491f24abdbdbf175e812b94e7ede338d1c7f01efb68574acd279a15a39cbe";
  const hash = rlphash(msg);
  assertEquals(hash.toString("hex"), r);
});
