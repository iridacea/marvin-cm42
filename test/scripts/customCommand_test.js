const Helper = require('hubot-test-helper')
const expect = require('chai').expect

const helper = new Helper('../../scripts/customCommand.js')

let originalDateNow = null

const createMessagesSender = room => async messages => {
  for (const message of messages) {
    await room.user.say('user1', message)
  }
}

describe('customCommand', () => {
  let room
  let userRoom
  let sendMessages

  beforeEach(() => {
    room = helper.createRoom()
    userRoom = helper.createRoom({ name: 'user1', httpd: false })
    sendMessages = createMessagesSender(room)
  })

  afterEach(() => {
    room.destroy()
    userRoom.destroy()
  })

  describe('add custom command', () => {
    describe('When is a single word command', () => {
      beforeEach(() => {
        return sendMessages([
          'hubot add command shipit Ship it!',
          '!shipit'
        ])
      })

      it('reply the custom command', () => {
        expect(room.messages).to.eql([
          ['user1', 'hubot add command shipit Ship it!'],
          [
            'hubot',
            "You've added the command *!shipit* with this reply: Ship it!"
          ],
          ['user1', '!shipit'],
          ['hubot', 'Ship it!']
        ])
      })
    })

    describe('When the command has underline', () => {
      beforeEach(() => {
        return sendMessages([
          'hubot add command ship_it Ship it!',
          '!ship_it'
        ])
      })

      it('reply the custom command', () => {
        expect(room.messages).to.eql([
          ['user1', 'hubot add command ship_it Ship it!'],
          [
            'hubot',
            "You've added the command *!ship_it* with this reply: Ship it!"
          ],
          ['user1', '!ship_it'],
          ['hubot', 'Ship it!']
        ])
      })
    })
  })

  describe('read custom command', () => {
    beforeEach(() => {
      return sendMessages(['hubot add command hello Hello World!'])
    })

    describe('When the command does not exists', () => {
      beforeEach(() => {
        return sendMessages(['!notFound'])
      })

      it('reply that the custom command does not exists', () => {
        expect(room.messages).to.eql([
          ['user1', 'hubot add command hello Hello World!'],
          [
            'hubot',
            "You've added the command *!hello* with this reply: Hello World!"
          ],
          ['user1', '!notFound'],
          [
            'hubot',
            'Hey, I haven\'t found anything, but you can add using: `marvin add command <key> "val"`'
          ]
        ])
      })
    })

    describe('When the command exists', () => {
      describe('and is in the beginning of a phrase', () => {
        beforeEach(() => {
          return sendMessages(['!hello guys'])
        })

        it('reply the custom command message', () => {
          expect(room.messages).to.eql([
            ['user1', 'hubot add command hello Hello World!'],
            [
              'hubot',
              "You've added the command *!hello* with this reply: Hello World!"
            ],
            ['user1', '!hello guys'],
            [
              'hubot',
              'Hello World!'
            ]
          ])
        })
      })

      describe('and is in the middle of a phrase', () => {
        beforeEach(() => {
          return sendMessages(['I just want to say !hello to all you guys'])
        })

        it('reply the custom command message', () => {
          expect(room.messages).to.eql([
            ['user1', 'hubot add command hello Hello World!'],
            [
              'hubot',
              "You've added the command *!hello* with this reply: Hello World!"
            ],
            ['user1', 'I just want to say !hello to all you guys'],
            [
              'hubot',
              'Hello World!'
            ]
          ])
        })
      })

      describe('and is in the ending of a phrase', () => {
        beforeEach(() => {
          return sendMessages(['I just want to say !hello'])
        })

        it('reply the custom command message', () => {
          expect(room.messages).to.eql([
            ['user1', 'hubot add command hello Hello World!'],
            [
              'hubot',
              "You've added the command *!hello* with this reply: Hello World!"
            ],
            ['user1', 'I just want to say !hello'],
            [
              'hubot',
              'Hello World!'
            ]
          ])
        })
      })

      describe('and there is a ! in the middle of a word', () => {
        beforeEach(() => {
          return sendMessages(['I just want to say!hello'])
        })

        it('does not reply the custom command message', () => {
          expect(room.messages).to.eql([
            ['user1', 'hubot add command hello Hello World!'],
            [
              'hubot',
              "You've added the command *!hello* with this reply: Hello World!"
            ],
            ['user1', 'I just want to say!hello']
          ])
        })
      })
    })
  })

  describe('list custom commands', () => {
    beforeEach(() => {
      return sendMessages([
        'hubot add command fake Ship it!',
        'hubot add command fake1 Ship it!',
        'hubot add command fake2 Ship it!',
        '!list'
      ])
    })

    it('reply the custom commands', () => {
      expect(room.messages).to.eql([
        ['user1', 'hubot add command fake Ship it!'],
        ['hubot', "You've added the command *!fake* with this reply: Ship it!"],
        ['user1', 'hubot add command fake1 Ship it!'],
        [
          'hubot',
          "You've added the command *!fake1* with this reply: Ship it!"
        ],
        ['user1', 'hubot add command fake2 Ship it!'],
        [
          'hubot',
          "You've added the command *!fake2* with this reply: Ship it!"
        ],
        ['user1', '!list']
      ])
      expect(room.robot.messagesTo.user1).to.eql([
        [
          'hubot',
          'Here you can see a list of commands created by our users:\n*!fake*\n*!fake1*\n*!fake2*'
        ]
      ])
    })
  })

  describe('delete custom command', () => {
    beforeEach(() => {
      return sendMessages([
        'hubot add command shipit Ship it!',
        'hubot delete command shipit'
      ])
    })

    it('remove the custom command', () => {
      expect(room.messages).to.eql([
        ['user1', 'hubot add command shipit Ship it!'],
        [
          'hubot',
          "You've added the command *!shipit* with this reply: Ship it!"
        ],
        ['user1', 'hubot delete command shipit'],
        ['hubot', 'You\'ve deleted the command *!shipit*']
      ])
    })
  })

  describe('custom command with arguments', () => {
    beforeEach(() => {
      return sendMessages([
        'hubot add command ygritte "You know nothing, <name>!"',
        'hubot !ygritte name=Jon Snow'
      ])
    })

    it('replaces the <name> with the given name', () => {
      expect(room.messages).to.eql([
        ['user1', 'hubot add command ygritte "You know nothing, <name>!"'],
        [
          'hubot',
          "You've added the command *!ygritte* with this reply: \"You know nothing, <name>!\""
        ],
        ['user1', 'hubot !ygritte name=Jon Snow'],
        ['hubot', '"You know nothing, Jon Snow!"']
      ])
    })
  })

  describe('custom command with a timestamp', () => {
    beforeEach(() => {
      originalDateNow = Date.now
      Date.now = () => 1550252713000
      return sendMessages([
        'hubot add command epoch "<timestamp> seconds have passed since Jan 01, 1970"',
        'hubot !epoch'
      ])
    })

    afterEach(function () {
      Date.now = originalDateNow
    })

    it('replaces the <timestamp> with the actual timestamp', () => {
      expect(room.messages).to.eql([
        ['user1', 'hubot add command epoch "<timestamp> seconds have passed since Jan 01, 1970"'],
        [
          'hubot',
          "You've added the command *!epoch* with this reply: \"<timestamp> seconds have passed since Jan 01, 1970\""
        ],
        ['user1', 'hubot !epoch'],
        ['hubot', '"1550252713 seconds have passed since Jan 01, 1970"']
      ])
    })
  })
})
