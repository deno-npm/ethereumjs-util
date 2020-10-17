import { zeros, defineProperties } from '../mod.ts'
import {
  Buffer
} from "../deps.js";
import {
  assertEquals,
  assertThrows,
} from "./deps.js";

  const fields = [
    {
      name: 'aword',
      alias: 'blah',
      word: true,
      default: Buffer.allocUnsafe(0),
    },
    {
      name: 'empty',
      allowZero: true,
      length: 20,
      default: Buffer.allocUnsafe(0),
    },
    {
      name: 'cannotBeZero',
      allowZero: false,
      default: Buffer.from([0]),
    },
    {
      name: 'value',
      default: Buffer.allocUnsafe(0),
    },
    {
      name: 'r',
      length: 32,
      allowLess: true,
      default: zeros(32),
    },
  ]

  Deno.test('defineProperties should trim zeros', function() {
    // deno-lint-ignore no-explicit-any
    var someOb: {[key: string]: any} = {}
    defineProperties(someOb, fields)
    // Define Properties
    someOb.r = '0x00004'
    assertEquals(someOb.r.toString('hex'), '04')

    someOb.r = Buffer.from([0, 0, 0, 0, 4])
    assertEquals(someOb.r.toString('hex'), '04')
  })

  Deno.test("defineProperties shouldn't allow wrong size for exact size requirements", function() {
    var someOb = {}
    defineProperties(someOb, fields)

    assertThrows(function() {
      const tmp = [
        {
          name: 'mustBeExactSize',
          allowZero: false,
          length: 20,
          default: Buffer.from([1, 2, 3, 4]),
        },
      ]
      defineProperties(someOb, tmp)
    })
  })

  Deno.test('defineProperties it should accept rlp encoded intial data', function() {
    // deno-lint-ignore no-explicit-any
    var someOb: any = {}
    var data = {
      aword: '0x01',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04',
    }

    var expected = {
      aword: '0x01',
      empty: '0x',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04',
    }

    var expectedArray = ['0x01', '0x', '0x02', '0x03', '0x04']

    defineProperties(someOb, fields, data)
    assertEquals(someOb.toJSON(true), expected, 'should produce the correctly labeled object')

    // deno-lint-ignore no-explicit-any
    var someOb2: any = {}
    var rlpEncoded = someOb.serialize().toString('hex')
    defineProperties(someOb2, fields, rlpEncoded)
    assertEquals(
      someOb2.serialize().toString('hex'),
      rlpEncoded,
      'the constuctor should accept rlp encoded buffers',
    )

    var someOb3 = {}
    defineProperties(someOb3, fields, expectedArray)
    assertEquals(someOb.toJSON(), expectedArray, 'should produce the correctly object')
  })

  Deno.test('defineProperties it should not accept invalid values in the constuctor', function() {
    var someOb = {}
    assertThrows(function() {
      defineProperties(someOb, fields, 5)
    }, Error);

    assertThrows(function() {
      defineProperties(someOb, fields, Array(6))
    }, Error)
  })

  Deno.test('defineProperties alias should work ', function() {
    // deno-lint-ignore no-explicit-any
    var someOb: any = {}
    var data = {
      aword: '0x01',
      cannotBeZero: '0x02',
      value: '0x03',
      r: '0x04',
    }

    defineProperties(someOb, fields, data)
    assertEquals(someOb.blah.toString('hex'), '01')
    someOb.blah = '0x09'
    assertEquals(someOb.blah.toString('hex'), '09')
    assertEquals(someOb.aword.toString('hex'), '09')
  })

  Deno.test('defineProperties alias should work #2', function() {
    // deno-lint-ignore no-explicit-any
    var someOb: any = {}
    var data = { blah: '0x1' }

    defineProperties(someOb, fields, data)
    assertEquals(someOb.blah.toString('hex'), '01')
    assertEquals(someOb.aword.toString('hex'), '01')
  })
