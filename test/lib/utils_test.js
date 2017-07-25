const { expect } = require('chai')
const { isAllowedStreamYardUser, preventUrlExpansion } = require('../../lib/utils')

describe('/lib/utils', () => {
  describe('.isAllowedStreamYardUser', () => {
    it('returns true for allowed uers', () => {
      process.env.ALLOWED_STREAMYARD_USERS = ['123']
      // eslint-disable-next-line no-unused-expressions
      expect(isAllowedStreamYardUser(123)).to.be.true
    })

    it('returns false for disallowed uers', () => {
      process.env.ALLOWED_STREAMYARD_USERS = ['123']
      // eslint-disable-next-line no-unused-expressions
      expect(isAllowedStreamYardUser(456)).to.be.false
    })
  })

  describe('.preventUrlExpansion', () => {
    it('wraps url in <> but do not touch other text', () => {
      const message = [
        'some simple message with',
        'one urt at http://example.com/foobar',
        'and other at http://codeminer42.com.br?somequery=dont%20panic'
      ].join('\n')

      expect(preventUrlExpansion(message)).to.eq([
        'some simple message with',
        'one urt at <http://example.com/foobar>',
        'and other at <http://codeminer42.com.br?somequery=dont%20panic>'
      ].join('\n'))
    })
  })
})
