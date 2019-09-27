'use strict'

function lexer (input) {
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

    let WHITESPACE = /\s/
    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    let NUMBERS = /[0-9]/
    if (NUMBERS.test(char)) {
      let value = ''

      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: 'number', value })
      continue
    }

    if (char === '$') {
      let value = ''
      char = input[++current]

      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: 'placeholder', value: {$placeholder: value} })
      continue
    }

    if (char === '"') {
      let value = ''
      char = input[++current]

      while (char !== '"') {
        value += char
        char = input[++current]
      }

      char = input[++current]

      tokens.push({ type: 'string', value })
      continue
    }

    let LETTERS = /[a-z]/i
    const ALPHANUM = /[a-z0-9]/i
    if (LETTERS.test(char)) {
      let value = ''

      while (ALPHANUM.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: 'literal', value })
      continue
    }

    throw new TypeError('Unexpected character ' + char)
  }

  // Then at the end of our `tokenizer` we simply return the tokens array.
  return tokens
}

module.exports = lexer
