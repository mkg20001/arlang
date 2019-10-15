'use strict'

/* eslint-disable no-continue */

function lexer (input) { // eslint-disable-line complexity
  let current = 0

  let tokens = []

  while (current < input.length) {
    let char = input[current]

    if (char === ',') {
      tokens.push({
        type: 'comma',
        value: char
      })

      current++
      continue
    }

    if (char === '(') {
      tokens.push({
        type: 'parensOpen',
        value: char
      })

      current++
      continue
    }

    if (char === ')') {
      tokens.push({
        type: 'parensClose',
        value: char
      })

      current++
      continue
    }

    if (char === '&') {
      tokens.push({
        type: 'and',
        value: char
      })

      current++
      continue
    }

    if (char === '=') {
      tokens.push({
        type: 'equals',
        value: char
      })

      current++
      continue
    }

    let WHITESPACE = /\s/
    if (char.match(WHITESPACE)) {
      current++
      continue
    }

    let NUMBERS = /[0-9]/
    if (char.match(NUMBERS)) {
      let value = ''

      while (char && char.match(NUMBERS)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: 'number', value })
      continue
    }

    if (char === '$') {
      let value = ''
      char = input[++current]

      while (char && char.match(NUMBERS)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: 'placeholder', value: {$placeholder: parseInt(value, 10)} })
      continue
    }

    if (char === '"') {
      let value = ''
      char = input[++current]

      while (char !== '"' && input[current - 1] !== '\\') {
        if (char === '\\' && input[current + 1] === '"') {
          char = input[++current]
        }

        value += char
        char = input[++current]
      }

      char = input[++current]

      tokens.push({ type: 'string', value })
      continue
    }

    if (char === "'") {
      let value = ''
      char = input[++current]

      while (char && char !== "'" && input[current - 1] !== '\\') {
        if (char === '\\' && input[current + 1] === "'") {
          char = input[++current]
        }

        value += char
        char = input[++current]
      }

      char = input[++current]

      tokens.push({ type: 'string', value })
      continue
    }

    let LETTERS = /[a-z]/i
    const ALPHANUM = /[a-z0-9]/i
    if (char.match(LETTERS)) {
      let value = ''

      while (char && char.match(ALPHANUM)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: 'literal', value: value.toLowerCase() })
      continue
    }

    throw new TypeError('Unexpected character ' + char)
  }

  // Then at the end of our `tokenizer` we simply return the tokens array.
  return tokens
}

module.exports = lexer
