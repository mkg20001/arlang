'use strict'

/* eslint-env mocha */

const equal = require('assert').strict.deepEqual

const main = require('..')

const query = "& (= a 'test') (= b 'test')"
const query2 = "and(equals(a, 'test'), equals(b, 'test'))"

function doTest (name, fnc, expected, err) {
  it(name, async () => {
    const res = await fnc()
    equal(res, expected, err)
  })
}

describe('arlang', () => {
  doTest(
    'should correctly parse sym lang query',
    () => main(query, {lang: 'sym'}),
    {},
    ''
  )

  doTest(
    'should correctly parse fnc lang query',
    () => main(query2, {lang: 'fnc'}),
    {},
    ''
  )
})
