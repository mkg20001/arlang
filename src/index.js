'use strict'

const lexer = require('./lexer')
const Lang = require('./lang')

module.exports = (string, {params, lang}) => {
  lang = Lang[lang]

  const tokens = lexer(string)
  return lang(tokens)
}
