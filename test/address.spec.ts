import { Address, BN, toBuffer } from "../mod.ts";
import { Buffer } from "../deps.js";
import { assertEquals, assertThrows } from "./deps.js";
const eip1014Testdata = await Deno.readTextFile(
  new URL("./testdata/eip1014Examples.json", import.meta.url),
)
  .then(JSON.parse);

const ZERO_ADDR_S = "0x0000000000000000000000000000000000000000";

Deno.test("Address should validate address length", () => {
  const str = "0x2f015c60e0be116b1f0cd534704db9c92118fb6a11";
  assertThrows(() => Address.fromString(str));
  const shortStr = "0x2f015c60e0be116b1f0cd534704db9c92118fb";
  assertThrows(() => Address.fromString(shortStr));
  const buf = toBuffer(str);
  assertThrows(() => new Address(buf));
});

Deno.test("Address should generate a zero address", () => {
  const addr = Address.zero();
  assertEquals(addr.buf, toBuffer(ZERO_ADDR_S));
  assertEquals(addr.toString(), ZERO_ADDR_S);
});

Deno.test("Address should instantiate address from zero address string", () => {
  const addr = Address.fromString(ZERO_ADDR_S);
  assertEquals(addr.toString(), ZERO_ADDR_S);
  assertEquals(addr.isZero(), true);
});

Deno.test("Address should detect non-zero address", () => {
  const str = "0x2f015c60e0be116b1f0cd534704db9c92118fb6a";
  const addr = Address.fromString(str);
  assertEquals(addr.isZero(), false);
});

Deno.test("Address should instantiate from public key", () => {
  const pubKey = Buffer.from(
    "3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d",
    "hex",
  );
  const str = "0x2f015c60e0be116b1f0cd534704db9c92118fb6a";
  const addr = Address.fromPublicKey(pubKey);
  assertEquals(addr.toString(), str);
});

Deno.test("Address should fail to instantiate from invalid public key", () => {
  const pubKey = Buffer.from(
    "3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744",
    "hex",
  );
  assertThrows(() => Address.fromPublicKey(pubKey));
});

Deno.test("Address should instantiate from private key", () => {
  // prettier-ignore
  const privateKey = Buffer.from(
    [
      234,
      84,
      189,
      197,
      45,
      22,
      63,
      136,
      201,
      58,
      176,
      97,
      87,
      130,
      207,
      113,
      138,
      46,
      251,
      158,
      81,
      167,
      152,
      154,
      171,
      27,
      8,
      6,
      126,
      156,
      28,
      95,
    ],
  );
  const str = "0x2f015c60e0be116b1f0cd534704db9c92118fb6a";
  const addr = Address.fromPrivateKey(privateKey);
  assertEquals(addr.toString(), str);
});

Deno.test("Address should generate address for created contract", () => {
  const from = Address.fromString("0x990ccf8a0de58091c028d6ff76bb235ee67c1c39");
  const addr = Address.generate(from, new BN(14));
  assertEquals(addr.toString(), "0xd658a4b8247c14868f3c512fa5cbb6e458e4a989");

  const addr2 = Address.generate(from, new BN(0));
  assertEquals(addr2.toString(), "0xbfa69ba91385206bfdd2d8b9c1a5d6c10097a85b");
});

Deno.test("Address should generate address for CREATE2", () => {
  for (const testdata of eip1014Testdata) {
    const { address, salt, initCode, result } = testdata;
    const from = Address.fromString(address);
    const addr = Address.generate2(from, toBuffer(salt), toBuffer(initCode));
    assertEquals(addr.toString(), result);
  }
});

Deno.test("Address should provide a buffer that does not mutate the original address", () => {
  const str = "0x2f015c60e0be116b1f0cd534704db9c92118fb6a";
  const address = Address.fromString(str);
  const addressBuf = address.toBuffer();
  addressBuf.fill(0);
  assertEquals(address.toString(), str);
});
