'use strict'

function sym (tokens) {
  let i = 0

  let block = 'exprLeft'
  let stack = []
  let cur = {}

  function unexpectedType (expected) {
    throw new TypeError(`Unexpected type ${tokens[i].type} at ${i}, expected ${expected}`)
  }

  while (tokens[i]) {
    const t = tokens[i]

    switch (block) {
      case 'exprLeft': {
        switch (t.type) {
          case 'and':
          case 'equals': {
            cur.op = t.type
            block = 'exprMiddle'
            i++
            break
          }
          default: {
            unexpectedType('and or equals')
          }
        }

        break
      }
      case 'exprMiddle': {
        switch (t.type) {
          case 'parensOpen': {
            stack.push([cur, 'exprRight'])
            cur = cur.expr1 = {}
            block = 'exprLeft'
            i++
            break
          }
          case 'literal': {
            cur.expr1 = t.value
            block = 'exprRight'
            i++
            break
          }
          default: {
            unexpectedType('parensOpen or literal')
          }
        }

        break
      }
      case 'exprRight': {
        switch (t.type) {
          case 'parensOpen': {
            stack.push([cur, 'exprEnd'])
            cur = cur.expr2 = {}
            block = 'exprLeft'
            i++
            break
          }
          case 'string': {
            cur.expr2 = t.value
            block = 'exprEnd'
            i++
            break
          }
          default: {
            unexpectedType('parsensOpen or string')
          }
        }

        break
      }
      case 'exprEnd': {
        switch (t.type) {
          case 'parensClose': {
            if (stack.length) {
              [cur, block] = stack.pop()
              i++
            } else {
              unexpectedType('(nothing in stack)')
            }
            break
          }
          default: {
            unexpectedType('parensClose')
          }
        }

        break
      }
      default: {
        throw new TypeError(block)
      }
    }
  }

  return cur
}

const specialNames = ['and', 'equals']
function fnc (tokens) { // eslint-disable-line no-complexity
  let i = 0

  let block = 'opNameOrVar'
  let stack = []
  let cur = {op: false, expr1: 'arql'}

  function unexpectedType (expected) {
    throw new TypeError(`Unexpected type ${tokens[i].type} at ${i}, expected ${expected}`)
  }

  while (tokens[i]) {
    const t = tokens[i]

    switch (block) {
      case 'opNameOrVar': {
        if (t.type !== 'literal') { unexpectedType('literal') }

        const name = t.value
        if (!specialNames.filter(e => e === name).length && !cur.op) { unexpectedType('literal with special name') }

        if (specialNames.filter(e => e === name).length) {
          let newCur = {op: name}
          if (cur.expr1) {
            stack.push([cur, 'end'])
            cur = cur.expr2 = newCur
          } else {
            stack.push([cur, 'comma'])
            cur = cur.expr1 = newCur
          }
          block = 'parens'
        } else { // it's a var
          if (cur.expr1) {
            unexpectedType('special literal')
          } else {
            cur.expr1 = t.value
            block = 'comma'
          }
        }
        i++

        break
      }
      case 'parens': {
        if (t.type === 'parensOpen') {
          block = 'opNameOrVar'
          i++
        } else {
          unexpectedType('parensOpen')
        }

        break
      }
      case 'comma': {
        if (t.type === 'comma') {
          block = 'value'
          i++
        } else {
          unexpectedType('comma')
        }

        break
      }
      case 'value': {
        if (t.type === 'string' || t.type === 'placeholder') {
          cur.expr2 = t.value
          block = 'end'
          i++
        } else if (t.type === 'literal' && specialNames.filter(e => e === t.value)) {
          block = 'opNameOrVar'
        } else {
          unexpectedType('string, special literal or placeholder')
        }

        break
      }

      case 'end': {
        if (t.type === 'parensClose') {
          if (stack.length) {
            [cur, block] = stack.pop()
            i++
          } else {
            unexpectedType('(nothing in stack)')
          }
        } else {
          unexpectedType('parensClose')
        }

        break
      }
      default: {
        throw new TypeError(block)
      }
    }
  }

  return cur.expr2
}

module.exports = {
  sym,
  fnc
}
