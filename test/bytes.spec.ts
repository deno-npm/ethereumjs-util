import {
  Address,
  zeros,
  zeroAddress,
  isZeroAddress,
  unpadBuffer,
  unpadArray,
  unpadHexString,
  setLengthLeft,
  setLengthRight,
  bufferToHex,
  bufferToInt,
  fromSigned,
  toUnsigned,
  addHexPrefix,
  toBuffer,
  baToJSON,
} from '../mod.ts'
import {
  BN,
  Buffer,
} from "../deps.js"
import {
  assert,
  assertEquals,
  assertThrows,
} from "./deps.js";

Deno.test('zeros should produce lots of 0s', function() {
  const z60 = zeros(30)
  const zs60 = '000000000000000000000000000000000000000000000000000000000000'
  assertEquals(z60.toString('hex'), zs60)
});

Deno.test('zeroAddress should generate a zero address', function() {
  assertEquals(zeroAddress(), '0x0000000000000000000000000000000000000000')
})

Deno.test('isZeroAddress works correctly', function() {
  assertEquals(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
  assertEquals(isZeroAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'), false)
})

Deno.test('isZeroAddress throws when address is not hex-prefixed', function() {
  assertThrows(function() {
    isZeroAddress('0000000000000000000000000000000000000000')
  })
})

Deno.test('unpadBuffer should unpad a Buffer', function() {
  const buf = toBuffer('0x0000000006600')
  const r = unpadBuffer(buf)
  assertEquals(r, toBuffer('0x6600'))
})

Deno.test('unpadArray should unpad an Array', function() {
  const arr = [0, 0, 0, 1]
  const r = unpadArray(arr)
  assertEquals(r, [1])
})

Deno.test('unpadHexString should unpad a hex prefixed string', function() {
  const str = '0x0000000006600'
  const r = unpadHexString(str)
  assertEquals(r, '6600')
})

Deno.test('unpadHexString should throw if input is not hex-prefixed', function() {
  assertThrows(function() {
    unpadHexString('0000000006600')
  })
})

Deno.test('setLengthLeft should left pad a Buffer', function() {
  const buf = Buffer.from([9, 9])
  const padded = setLengthLeft(buf, 3)
  assertEquals(padded.toString('hex'), '000909')
})

Deno.test('setLengthLeft should left truncate a Buffer', function() {
  const buf = Buffer.from([9, 0, 9])
  const padded = setLengthLeft(buf, 2)
  assertEquals(padded.toString('hex'), '0009')
})


  Deno.test('setLengthRight should right pad a Buffer', function() {
    const buf = Buffer.from([9, 9])
    const padded = setLengthRight(buf, 3)
    assertEquals(padded.toString('hex'), '090900')
  })
  Deno.test('setLengthRight should right truncate a Buffer', function() {
    const buf = Buffer.from([9, 0, 9])
    const padded = setLengthRight(buf, 2)
    assertEquals(padded.toString('hex'), '0900')
  })

  Deno.test('bufferToHex should convert a buffer to hex', function() {
    const buf = Buffer.from('5b9ac8', 'hex')
    const hex = bufferToHex(buf)
    assertEquals(hex, '0x5b9ac8')
  })
  Deno.test('bufferToHex works with empty buffer', function() {
    const buf = Buffer.alloc(0)
    const hex = bufferToHex(buf)
    assertEquals(hex, '0x')
  })

  Deno.test('bufferToInt should convert a int to hex', function() {
    const buf = Buffer.from('5b9ac8', 'hex')
    const i = bufferToInt(buf)
    assertEquals(i, 6003400)
    assertEquals(bufferToInt(Buffer.allocUnsafe(0)), 0)
  })
  Deno.test('bufferToInt should convert empty input to 0', function() {
    assertEquals(bufferToInt(Buffer.allocUnsafe(0)), 0)
  })

  Deno.test('fromSigned should convert an unsigned (negative) buffer to a singed number', function() {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const buf = Buffer.allocUnsafe(32).fill(0)
    buf[0] = 255

    assertEquals(fromSigned(buf).toString(), neg)
  })
  Deno.test('fromSigned should convert an unsigned (positive) buffer to a singed number', function() {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const buf = Buffer.allocUnsafe(32).fill(0)
    buf[0] = 1

    assertEquals(fromSigned(buf).toString(), neg)
  })

  Deno.test('toUnsigned should convert a signed (negative) number to unsigned', function() {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = 'ff00000000000000000000000000000000000000000000000000000000000000'
    const num = new BN(neg)

    assertEquals(toUnsigned(num).toString('hex'), hex)
  })

  Deno.test('toUnsigned should convert a signed (positive) number to unsigned', function() {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0100000000000000000000000000000000000000000000000000000000000000'
    const num = new BN(neg)

    assertEquals(toUnsigned(num).toString('hex'), hex)
  })

  const string = 'd658a4b8247c14868f3c512fa5cbb6e458e4a989'
  Deno.test('addHexPrefix should add', function() {
    assertEquals(addHexPrefix(string), '0x' + string)
  })
  Deno.test('addHexPrefix should return on non-string input', function() {
    assertEquals(addHexPrefix(1 as unknown as string), 1)
  })


  Deno.test('toBuffer transforms to buffer', function() {
    // Buffer
    assertEquals(toBuffer(Buffer.allocUnsafe(0)), Buffer.allocUnsafe(0))
    // Array
    assertEquals(toBuffer([]), Buffer.allocUnsafe(0))
    // String
    assertEquals(toBuffer('0x11'), Buffer.from([17]))
    assertEquals(toBuffer('0x1234').toString('hex'), '1234')
    assertEquals(toBuffer('0x'), Buffer.from([]))
    // Number
    assertEquals(toBuffer(1), Buffer.from([1]))
    // null
    assertEquals(toBuffer(null), Buffer.allocUnsafe(0))
    // undefined
    assertEquals(toBuffer(undefined), Buffer.allocUnsafe(0))
    // 'toBN'
    assertEquals(toBuffer(new BN(1)), Buffer.from([1]))
    // 'toArray'
    assertEquals(
      toBuffer({
        toArray: function() {
          return [1] as unknown as Uint8Array;
        },
      }),
      Buffer.from([1]),
    )
  })

  Deno.test('toBuffer fails with non 0x-prefixed hex strings', function() {
    assertThrows(() => toBuffer('11'), Error, '11')
    assertThrows(() => toBuffer(''))
    assertThrows(() => toBuffer('0xR'), Error, '0xR')
  })

  Deno.test('should convert a TransformableToBuffer like the Address class (i.e. provides a toBuffer method)', function() {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address = Address.fromString(str)
    const addressBuf = toBuffer(address)
    assert(addressBuf.equals(address.toBuffer()))
  })

  Deno.test('baToJSON should turn a array of buffers into a pure json object', function() {
    const ba = [Buffer.from([0]), Buffer.from([1]), [Buffer.from([2])]]
    assertEquals(baToJSON(ba), ['0x00', '0x01', ['0x02']])
  })
  Deno.test('baToJSON should turn a buffers into string', function() {
    assertEquals(baToJSON(Buffer.from([0])), '0x00')
  })