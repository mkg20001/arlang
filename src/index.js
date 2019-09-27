'use strict'

const lexer = require('./lexer')
const Lang = require('./lang')

function replaceParams (query, params) {
  if (query.expr1.$placeholder) {
    query.expr1 = params[query.expr1.$placeholder - 1]
  } else if (query.expr1.op) {
    replaceParams(query.expr1, params)
  }

  if (query.expr2.$placeholder) {
    query.expr2 = params[query.expr2.$placeholder - 1]
  } else if (query.expr2.op) {
    replaceParams(query.expr2, params)
  }
}

module.exports = (string, {params, lang}) => {
  lang = Lang[lang]

  const tokens = lexer(string)
  const query = lang(tokens)

  if (params) {
    replaceParams(query, params)
  }

  return query
}
