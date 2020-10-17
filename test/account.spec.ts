import {
  Account,
  BN,
  generateAddress,
  generateAddress2,
  importPublic,
  isValidAddress,
  isValidChecksumAddress,
  isValidPrivate,
  isValidPublic,
  privateToAddress,
  privateToPublic,
  publicToAddress,
  rlp,
  toBuffer,
  toChecksumAddress,
} from '../mod.ts';
import {
  Buffer,
} from "../deps.js"
import {
  assert,
  assertEquals,
  assertThrows,
} from "./deps.js"

const eip1014Testdata = await Deno.readTextFile(
  new URL('./testdata/eip1014Examples.json', import.meta.url)
)
  .then(JSON.parse);

Deno.test("Account from empty", () => {
  const account = new Account()
  assert(account.nonce.isZero())
  assert(account.balance.isZero())
  // stateRoot equals KECCAK256_RLP
  assertEquals(
    account.stateRoot.toString('hex'),
    '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  )
  // codeHash equals to KECCAK256_NULL
  assertEquals(
    account.codeHash.toString('hex'),
    'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  )
});

Deno.test('Account from array', function() {
  const raw = [
    '0x02', // nonce
    '0x0384', // balance
    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', // stateRoot
    '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470', // codeHash
  ]
  const account = Account.fromValuesArray(raw.map(toBuffer))
    assert(account.nonce.eqn(2))
    assert(account.balance.eqn(900))
    assertEquals(
      account.stateRoot.toString('hex'),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    )
    assertEquals(
      account.codeHash.toString('hex'),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    )
})

Deno.test("Account from object", () => {
  const raw = {
    nonce: '0x02',
    balance: '0x0384',
    stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  }
  const account = Account.fromAccountData(raw)
    assert(account.nonce.eqn(2))
    assert(account.balance.eqn(900))
    assertEquals(
      account.stateRoot.toString('hex'),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    )
    assertEquals(
      account.codeHash.toString('hex'),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    )
})

Deno.test('Account from RLP', function() {
  const accountRlp = Buffer.from(
    'f84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    'hex',
  )
  const account = Account.fromRlpSerializedAccount(accountRlp)
    assert(account.nonce.eqn(2))
    assert(account.balance.eqn(900))
    assertEquals(
      account.stateRoot.toString('hex'),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    )
    assertEquals(
      account.codeHash.toString('hex'),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    )
})

Deno.test('Account serializes correctly', function() {
  const raw = {
    nonce: '0x01',
    balance: '0x42',
    stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  }
  const account = Account.fromAccountData(raw)
  const accountRlp = rlp.encode([raw.nonce, raw.balance, raw.stateRoot, raw.codeHash])
    assert(account.serialize().equals(accountRlp))
})

Deno.test('Account isContract', function() {
    const accountRlp = Buffer.from(
      'f84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'hex',
    )
    const account_1 = Account.fromRlpSerializedAccount(accountRlp)
    assertEquals(account_1.isContract(), false)

    const raw = {
      nonce: '0x01',
      balance: '0x0042',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    const account_2 = Account.fromAccountData(raw)
    assert(account_2.isContract())
})

Deno.test('Account isEmpty', function() {
    const account_1 = new Account()
    assert(account_1.isEmpty())

    const raw = {
      nonce: '0x01',
      balance: '0x0042',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b',
    }
    const account_2 = Account.fromAccountData(raw)
    assertEquals(account_2.isEmpty(), false)
})

Deno.test("Account throws on invalid data", () => {
    // only accept length 32 buffer for stateRoot
    assertThrows(() => {
      new Account(undefined, undefined, Buffer.from('hey'), undefined)
    })

    // only accept length 32 buffer for codeHash
    assertThrows(() => {
      new Account(undefined, undefined, undefined, Buffer.from('hey'))
    })

    // only accept nonce more than 0
    assertThrows(() => {
      new Account(new BN(-5))
    })

    // only accept balance more than 0
    assertThrows(() => {
      new Account(undefined, new BN(-5))
    })
})

const SECP256K1_N = new BN('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 16)
  Deno.test('isValidPrivate should fail on short input', function() {
    const tmp = '0011223344'
    assertThrows(function() {
      isValidPrivate(Buffer.from(tmp, 'hex'))
    })
  })
  Deno.test('isValidPrivate should fail on too big input', function() {
    const tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assertThrows(function() {
      isValidPrivate(Buffer.from(tmp, 'hex'))
    })
  })
  Deno.test('isValidPrivate should fail on invalid curve (zero)', function() {
    const tmp = '0000000000000000000000000000000000000000000000000000000000000000'
    assertEquals(isValidPrivate(Buffer.from(tmp, 'hex')), false)
  })
  Deno.test('isValidPrivate should fail on invalid curve (== N)', function() {
    const tmp = SECP256K1_N.toString(16)
    assertEquals(isValidPrivate(Buffer.from(tmp, 'hex')), false)
  })
  Deno.test('isValidPrivate should fail on invalid curve (>= N)', function() {
    const tmp = SECP256K1_N.addn(1).toString(16)
    assertEquals(isValidPrivate(Buffer.from(tmp, 'hex')), false)
  })
  Deno.test('isValidPrivate should work otherwise (< N)', function() {
    const tmp = SECP256K1_N.subn(1).toString(16)
    assertEquals(isValidPrivate(Buffer.from(tmp, 'hex')), true)
  })

  Deno.test('isValidPublic should fail on too short input', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex',
    )
    assertEquals(isValidPublic(pubKey), false)
  })
  Deno.test('isValidPublic should fail on too big input', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d00',
      'hex',
    )
    assertEquals(isValidPublic(pubKey), false)
  })
  Deno.test('isValidPublic should fail on SEC1 key', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assertEquals(isValidPublic(pubKey), false)
  })
  Deno.test("shouldn't fail on SEC1 key with sanitize enabled", function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assertEquals(isValidPublic(pubKey, true), true)
  })
  Deno.test('isValidPublic should fail with an invalid SEC1 public key', function() {
    const pubKey = Buffer.from(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assertEquals(isValidPublic(pubKey, true), false)
  })
  Deno.test('isValidPublic should work with compressed keys with sanitize enabled', function() {
    const pubKey = Buffer.from(
      '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a',
      'hex',
    )
    assertEquals(isValidPublic(pubKey, true), true)
  })
  Deno.test('isValidPublic should work with sanitize enabled', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assertEquals(isValidPublic(pubKey, true), true)
  })
  Deno.test('isValidPublic should work otherwise', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assertEquals(isValidPublic(pubKey), true)
  })

  const pubKey =
    '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
  Deno.test('importPublic should work with an Ethereum public key', function() {
    const tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assertEquals(importPublic(Buffer.from(tmp, 'hex')).toString('hex'), pubKey)
  })
  Deno.test('importPublic should work with uncompressed SEC1 keys', function() {
    const tmp =
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    assertEquals(importPublic(Buffer.from(tmp, 'hex')).toString('hex'), pubKey)
  })
  Deno.test('importPublic should work with compressed SEC1 keys', function() {
    const tmp = '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a'
    assertEquals(importPublic(Buffer.from(tmp, 'hex')).toString('hex'), pubKey)
  })

  Deno.test('publicToAddress should produce an address given a public key', function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const r = publicToAddress(pubKey)
    assertEquals(r.toString('hex'), address)
  })
  Deno.test('publicToAddress should produce an address given a SEC1 public key', function() {
    const pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const r = publicToAddress(pubKey, true)
    assertEquals(r.toString('hex'), address)
  })
  Deno.test("publicToAddress shouldn't produce an address given an invalid SEC1 public key", function() {
    const pubKey = Buffer.from(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex',
    )
    assertThrows(function() {
      publicToAddress(pubKey, true)
    })
  })
  Deno.test("publicToAddress shouldn't produce an address given an invalid public key", function() {
    const pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex',
    )
    assertThrows(function() {
      publicToAddress(pubKey)
    })
  })

  Deno.test('privateToPublic should produce a public key given a private key', function() {
    const pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    const privateKey = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f',
      'hex',
    )
    const r = privateToPublic(privateKey).toString('hex')
    assertEquals(r, pubKey)
  })
  Deno.test("privateToPublic shouldn't produce a public key given an invalid private key", function() {
    const privateKey1 = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f2a',
      'hex',
    )
    const privateKey2 = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c',
      'hex',
    )
    assertThrows(function() {
      privateToPublic(privateKey1)
    })
    assertThrows(function() {
      privateToPublic(privateKey2)
    })
  })

  Deno.test('privateToAddress should produce an address given a private key', function() {
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    // Our private key
    const privateKey = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f',
      'hex',
    )
    const r = privateToAddress(privateKey).toString('hex')
    assertEquals(r, address)
  })

  Deno.test('generateAddress should produce an address given a public key', function() {
    const add = generateAddress(
      Buffer.from('990ccf8a0de58091c028d6ff76bb235ee67c1c39', 'utf8'),
      toBuffer(14),
    ).toString('hex')
    assertEquals(add, '936a4295d8d74e310c0c95f0a63e53737b998d12')
  })

  Deno.test('generateAddress hex should produce an address given a public key', function() {
    const add = generateAddress(
      toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBuffer(14),
    ).toString('hex')
    assertEquals(add, 'd658a4b8247c14868f3c512fa5cbb6e458e4a989')
  })

  Deno.test('generateAddress nonce 0 should produce an address given a public key', function() {
    const add = generateAddress(
      toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBuffer(0),
    ).toString('hex')
    assertEquals(add, 'bfa69ba91385206bfdd2d8b9c1a5d6c10097a85b')
  })

for (let i = 0; i <= 6; i++) {
  const e = eip1014Testdata[i]
  Deno.test(`generateAddress2 ${e['comment']}: generates the correct address`, function() {
    const result = generateAddress2(
      toBuffer(e['address']),
      toBuffer(e['salt']),
      toBuffer(e['initCode']),
    )
    assertEquals('0x' + result.toString('hex'), e['result'])
  })
}

const eip55ChecksumAddresses = [
  // All caps
  '0x52908400098527886E0F7030069857D2E4169EE7',
  '0x8617E340B3D01FA5F11F306F4090FD50E238070D',
  // All Lower
  '0xde709f2102306220921060314715629080e2fb77',
  '0x27b1fdb04752bbc536007a920d24acb045561c26',
  // Normal
  '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
  '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
  '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
  '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
]

const eip1191ChecksummAddresses = {
  1: [
    '0x88021160c5C792225E4E5452585947470010289d',
    '0x27b1FdB04752bBc536007a920D24ACB045561c26',
    '0x52908400098527886e0f7030069857D2e4169EE7',
    '0x5aaeB6053f3E94C9b9A09f33669435e7Ef1bEAed',
    '0x8617E340b3d01FA5F11F306f4090FD50E238070d',
    '0xd1220a0CF47C7B9Be7A2E6ba89F429762E7B9Adb',
    '0xdBf03b407c01e7cD3CBea99509d93f8dDDC8C6fB',
    '0xDe709F2102306220921060314715629080E2fb77',
    '0xfb6916095Ca1dF60bB79cE92ce3ea74C37c5D359',
  ],
  30: [
    '0x6549F4939460DE12611948B3F82B88C3C8975323',
    '0x27b1FdB04752BBc536007A920D24ACB045561c26',
    '0x3599689E6292B81B2D85451025146515070129Bb',
    '0x52908400098527886E0F7030069857D2E4169ee7',
    '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD',
    '0x8617E340b3D01Fa5f11f306f4090fd50E238070D',
    '0xD1220A0Cf47c7B9BE7a2e6ba89F429762E7B9adB',
    '0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB',
    '0xDe709F2102306220921060314715629080e2FB77',
    '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359',
  ],
  31: [
    '0x42712D45473476B98452F434E72461577D686318',
    '0x27B1FdB04752BbC536007a920D24acB045561C26',
    '0x3599689e6292b81b2D85451025146515070129Bb',
    '0x52908400098527886E0F7030069857D2e4169EE7',
    '0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd',
    '0x66f9664F97F2b50f62d13eA064982F936DE76657',
    '0x8617e340b3D01fa5F11f306F4090Fd50e238070d',
    '0xDE709F2102306220921060314715629080e2Fb77',
    '0xFb6916095CA1dF60bb79CE92ce3Ea74C37c5D359',
    '0xd1220a0CF47c7B9Be7A2E6Ba89f429762E7b9adB',
    '0xdbF03B407C01E7cd3cbEa99509D93f8dDDc8C6fB',
  ],
}

Deno.test('toChecksumAddress EIP55', function() {
  for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
    const tmp = eip55ChecksumAddresses[i]
    assertEquals(toChecksumAddress(tmp.toLowerCase()), tmp)
  }
})

Deno.test('toChecksumAddress EIP1191', function() {
  for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
    for (const addr of addresses) {
      assertEquals(toChecksumAddress(addr.toLowerCase(), Number(chainId)), addr)
    }
  }
})

Deno.test('toChecksumAddress throws when the address is not hex-prefixed', function() {
  assertThrows(function() {
    toChecksumAddress('52908400098527886E0F7030069857D2E4169EE7'.toLowerCase())
  })
})

Deno.test('isValidChecksumAddress EIP55', function() {
  for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
    assertEquals(isValidChecksumAddress(eip55ChecksumAddresses[i]), true)
  }
  assertEquals(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'), false)
})

Deno.test('isValidChecksumAddress EIP1191', function() {
  for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
    for (const addr of addresses) {
      assertEquals(isValidChecksumAddress(addr, Number(chainId)), true)
    }
  }

  // If we set the chain id, an EIP55 encoded address should be invalid
  for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
    assertEquals(isValidChecksumAddress(eip55ChecksumAddresses[i], 1), false)
  }

  assertEquals(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a', 1), false)

  //Should return false cause wrong chain id is used
  for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
    for (const addr of addresses) {
      assertEquals(isValidChecksumAddress(addr, Number(chainId) + 1), false)
    }
  }
})

Deno.test('isValidChecksumAddress throws when the address is not hex-prefixed', function() {
  assertThrows(function() {
    isValidChecksumAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a')
  })
})

Deno.test('isValidAddress', function() {
  assertEquals(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'), true)
  assertEquals(isValidAddress('0x52908400098527886E0F7030069857D2E4169EE7'), true)

  assertEquals(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6'), false)
  assertEquals(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6aa'), false)
})

Deno.test('isValidAddress throws when input is not hex prefixed', function() {
  assertThrows(function() {
    isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a')
  })
  assertThrows(function() {
    isValidAddress('x2f015c60e0be116b1f0cd534704db9c92118fb6a')
  })
  assertThrows(function() {
    isValidAddress('0X52908400098527886E0F7030069857D2E4169EE7')
  })
})
