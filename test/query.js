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

const queryRes = {
  expr1: {
    expr1: 'a',
    expr2: 'test',
    op: 'equals'
  },
  expr2: {
    expr1: 'b',
    expr2: 'test',
    op: 'equals'
  },
  op: 'and'
}

describe('arlang', () => {
  doTest(
    'should correctly parse sym lang query',
    () => main(query, {lang: 'sym'}),
    queryRes,
    ''
  )

  doTest(
    'should correctly parse fnc lang query',
    () => main(query2, {lang: 'fnc'}),
    queryRes,
    ''
  )
})
