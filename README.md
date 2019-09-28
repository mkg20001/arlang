# arlang

Human-readable ARQL query language

# Usage

arlang accepts a string and a few options. It returns a valid arql query.

```js

const arlang = require('arlang')
const arweave = require('arweave').init({ host: 'arweave.net', protocol: 'https', port: 443 })

// let's make a query
const query = arlang('& (= someTag "someValue") (otherTag = "otherValue")', {lang: 'sym'})
// if you don't like the language, we have another one for you
const query2 = arlang('and(equals(someTag, "someValue"), equals(otherTag, "otherValue"))', {lang: 'fnc'})

// now let's run the query
const result = await arweave.arql(query) // doesn't matter which one we take, they're both equal

// worried about ARQL injections? we've got 'ya covered
const queryWithPlaceholdoers = arlang('and(equals(someTag, $1), equals(otherTag, $2))', {lang: 'sym', params: ['someValue', 'someTag']})
```
