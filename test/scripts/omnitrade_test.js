const Helper = require('hubot-test-helper')
const co = require('co')
const expect = require('chai').expect
const sinon = require('sinon')

const helper = new Helper('../../scripts/omnitrade.js')

describe('omnitrade', () => {
  let sandbox

  beforeEach(() => {
    this.room = helper.createRoom()
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    this.room.destroy()
    sandbox.restore()
  })

  describe('omnitrade markets', () => {
    const expected = JSON.stringify({
      btcbrl: {
        ticker: { last: 15000.0 }
      }
    })

    beforeEach(() => {
      sandbox.stub(this.room.robot, 'http').returns({
        get: () => (cb) => cb(null, null, expected)
      })

      return co(function * () {
        yield this.room.user.say('user1', 'omnitrade markets')
      }.bind(this))
    })

    it('sends current price of all markets', () => {
      expect(this.room.messages).to.eql([
        ['user1', 'omnitrade markets'],
        ['hubot', '```BTC/BRL: R$15.000,00\n```']
      ])
    })
  })

  context('omnitrade price {market}', () => {
    context('with a correct market', () => {
      const expected = JSON.stringify({
        ticker: { last: 1700.0 }
      })

      beforeEach(() => {
        sandbox.stub(this.room.robot, 'http').returns({
          get: () => (cb) => cb(null, { statusCode: 200 }, expected)
        })

        return co(function * () {
          yield this.room.user.say('user1', 'omnitrade price ethbrl')
        }.bind(this))
      })

      it('sends current price for the market', () => {
        expect(this.room.messages).to.eql([
          ['user1', 'omnitrade price ethbrl'],
          ['hubot', '```ETH/BRL: R$1.700,00```']
        ])
      })
    })

    context('with a wrong market', () => {
      const expected = JSON.stringify({
        status: 500,
        error: 'Internal Server Error'
      })

      beforeEach(() => {
        sandbox.stub(this.room.robot, 'http').returns({
          get: () => (cb) => cb(null, { statusCode: 500 }, expected)
        })

        return co(function * () {
          yield this.room.user.say('user1', 'omnitrade price something')
        }.bind(this))
      })

      it('sends current price for the market', () => {
        expect(this.room.messages).to.eql([
          ['user1', 'omnitrade price something'],
          ['hubot', 'Sorry. Can\'t find a market with that name.']
        ])
      })
    })
  })
})
