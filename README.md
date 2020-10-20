# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-util.svg)](https://www.npmjs.org/package/ethereumjs-util)
[![Actions Status](https://github.com/ethereumjs/ethereumjs-util/workflows/Build/badge.svg)](https://github.com/ethereumjs/ethereumjs-util/actions)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-util.svg)](https://coveralls.io/r/ethereumjs/ethereumjs-util)
[![Discord][discord-badge]][discord-link]

A collection of utility functions for Ethereum. It can be used in Node.js and in the browser with [browserify](http://browserify.org/).

Based on the incredible work by https://github.com/ethereumjs

# USAGE

```js
import {
  assert,
  assertEquals
} from 'assert'
import {
  isValidChecksumAddress,
  unpadBuffer,
  BN,
} from 'https://deno.land/x/npm_ethereumjs_util@0.0.3/mod.ts'

const address = '0x2F015C60E0be116B1f0CD534704Db9c92118FB6A'
assert(isValidChecksumAddress(address))

assertEquals(unpadBuffer(Buffer.from('000000006600', 'hex')), Buffer.from('6600', 'hex'))

assertEquals(new BN('dead', 16).add(new BN('101010', 2)), 57047)
```

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

MPL-2.0

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
