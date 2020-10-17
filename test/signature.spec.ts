import {
  BN,
  ecsign,
  ecrecover,
  privateToPublic,
  hashPersonalMessage,
  isValidSignature,
  fromRpcSig,
  toRpcSig,
} from '../mod.ts'
import {
  Buffer
} from "../deps.js"
import {
  assertEquals,
  assertThrows,
} from "./deps.js"

const echash = Buffer.from(
  '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28',
  'hex',
)
const ecprivkey = Buffer.from(
  '3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1',
  'hex',
)
const chainId = 3 // ropsten

  Deno.test('ecsign should produce a signature', function() {
    const sig = ecsign(echash, ecprivkey)
    assertEquals(
      sig.r,
      Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex'),
    )
    assertEquals(
      sig.s,
      Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex'),
    )
    assertEquals(sig.v, 27)
  })

  Deno.test('ecsign should produce a signature for Ropsten testnet', function() {
    const sig = ecsign(echash, ecprivkey, chainId)
    assertEquals(
      sig.r,
      Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex'),
    )
    assertEquals(
      sig.s,
      Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex'),
    )
    assertEquals(sig.v, 41)
  })

  Deno.test('ecrecover should recover a public key', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    const pubkey = ecrecover(echash, v, r, s)
    assertEquals(pubkey, privateToPublic(ecprivkey))
  })
  Deno.test('ecrecover should recover a public key (chainId = 3)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 41
    const pubkey = ecrecover(echash, v, r, s, chainId)
    assertEquals(pubkey, privateToPublic(ecprivkey))
  })
  Deno.test('ecrecover should fail on an invalid signature (v = 21)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assertThrows(function() {
      ecrecover(echash, 21, r, s)
    })
  })
  Deno.test('ecrecover should fail on an invalid signature (v = 29)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assertThrows(function() {
      ecrecover(echash, 29, r, s)
    })
  })
  Deno.test('ecrecover should fail on an invalid signature (swapped points)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assertThrows(function() {
      ecrecover(echash, 27, s, r)
    })
  })


  Deno.test('hashPersonalMessage should produce a deterministic hash', function() {
    const h = hashPersonalMessage(Buffer.from('Hello world'))
    assertEquals(
      h,
      Buffer.from('8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede', 'hex'),
    )
  })

  Deno.test('isValidSignature should fail on an invalid signature (shorter r))', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1ab', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assertEquals(isValidSignature(27, r, s), false)
  })
  Deno.test('isValidSignature should fail on an invalid signature (shorter s))', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca', 'hex')
    assertEquals(isValidSignature(27, r, s), false)
  })
  Deno.test('isValidSignature should fail on an invalid signature (v = 21)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assertEquals(isValidSignature(21, r, s), false)
  })
  Deno.test('isValidSignature should fail on an invalid signature (v = 29)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assertEquals(isValidSignature(29, r, s), false)
  })
  Deno.test('isValidSignature should fail when on homestead and s > secp256k1n/2', function() {
    const SECP256K1_N_DIV_2 = new BN(
      '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
      16,
    )

    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from(SECP256K1_N_DIV_2.add(new BN('1', 16)).toString(16), 'hex')

    const v = 27
    assertEquals(isValidSignature(v, r, s, true), false)
  })
  Deno.test('isValidSignature should not fail when not on homestead but s > secp256k1n/2', function() {
    const SECP256K1_N_DIV_2 = new BN(
      '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
      16,
    )

    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from(SECP256K1_N_DIV_2.add(new BN('1', 16)).toString(16), 'hex')

    const v = 27
    assertEquals(isValidSignature(v, r, s, false), true)
  })
  Deno.test('isValidSignature should work otherwise', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    assertEquals(isValidSignature(v, r, s), true)
  })
  Deno.test('isValidSignature should work otherwise(chainId=3)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 41
    assertEquals(isValidSignature(v, r, s, false, chainId), true)
  })

  const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
  const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')

  Deno.test('toRpcSig should return hex strings that the RPC can use', function() {
    assertEquals(
      toRpcSig(27, r, s),
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca661b',
    )
    assertEquals(
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca661b',
      ),
      {
        v: 27,
        r: r,
        s: s,
      },
    )
    assertEquals(
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca6600',
      ),
      {
        v: 27,
        r: r,
        s: s,
      },
    )
  })

  Deno.test('fromRpcSig should throw on invalid length', function() {
    assertThrows(function() {
      fromRpcSig('')
    })
    assertThrows(function() {
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca660042',
      )
    })
  })

  Deno.test('toRpcSig pad short r and s values', function() {
    assertEquals(
      toRpcSig(27, r.slice(20), s.slice(20)),
      '0x00000000000000000000000000000000000000004a1579cf389ef88b20a1abe90000000000000000000000000000000000000000326fa689f228040429e3ca661b',
    )
  })

  Deno.test('toRpcSig should throw on invalid v value', function() {
    assertThrows(function() {
      toRpcSig(1, r, s)
    })
  })
