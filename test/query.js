'use strict'

/* eslint-env mocha */

const equal = require('assert').strict.deepEqual

const main = require('..')

const query = "& (= a 'test1') (= b 'test2')"
const query2 = "and(equals(a, 'test1'), equals(b, 'test2'))"
const query3 = '& (= a $1) (= b $2)'
const query4 = 'and(equals(a, $1), equals(b, $2))'

function doTest (name, fnc, expected, err) {
  it(name, async () => {
    const res = await fnc()
    equal(res, expected, err)
  })
}

const queryRes = {
  expr1: {
    expr1: 'a',
    expr2: 'test1',
    op: 'equals'
  },
  expr2: {
    expr1: 'b',
    expr2: 'test2',
    op: 'equals'
  },
  op: 'and'
}

describe('arlang', () => {
  doTest(
    'should correctly parse sym lang query',
    () => main(query, {lang: 'sym'}),
    queryRes
  )

  doTest(
    'should correctly parse fnc lang query',
    () => main(query2, {lang: 'fnc'}),
    queryRes
  )

  doTest(
    'should correctly parse sym lang query with placeholders',
    () => main(query3, {lang: 'sym', params: ['test1', 'test2']}),
    queryRes
  )

  doTest(
    'should correctly parse fnc lang query with placeholders',
    () => main(query4, {lang: 'fnc', params: ['test1', 'test2']}),
    queryRes
  )

  it('should not blow up on undefined', async () => {
    main('equals', {lang: 'fnc'})
  })
})
