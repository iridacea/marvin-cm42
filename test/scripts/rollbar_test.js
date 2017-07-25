const Helper = require('hubot-test-helper')
const co = require('co')
const expect = require('chai').expect

const helper = new Helper('../../scripts/rollbar.js')

/* eslint-disable quotes */
const data = JSON.stringify({
  event_name: "new_item",
  data: {
    item: {
      public_item_id: null,
      integrations_data: {},
      last_activated_timestamp: 1382655421,
      unique_occurrences: null,
      id: 272716944,
      environment: "production",
      title: "testing rollbar integration",
      last_occurrence_id: 481761639,
      last_occurrence_timestamp: 1382655421,
      platform: 0,
      first_occurrence_timestamp: 1382655421,
      project_id: 90,
      resolved_in_version: null,
      status: 1,
      hash: "c595b2ae0af9b397bb6bdafd57104ac4d5f6b382",
      last_occurrence: {
        body: {
          message: {
            body: "testing rollbar integration"
          }
        },
        uuid: "d2036647-e0b7-4cad-bc98-934831b9b6d1",
        language: "python",
        level: "error",
        timestamp: 1382655421,
        server: {
          host: "dev",
          argv: [
            ""
          ]
        },
        environment: "production",
        framework: "unknown",
        notifier: {
          version: "0.5.12",
          name: "pyrollbar"
        },
        metadata: {
          access_token: "",
          debug: {
            routes: {
              start_time: 1382212080401,
              counters: {
                post_item: 3274122
              }
            }
          },
          customer_timestamp: 1382655421,
          api_server_hostname: "web6"
        }
      },
      framework: 0,
      total_occurrences: 1,
      level: 40,
      counter: 4,
      first_occurrence_id: 481761639,
      activating_occurrence_id: 481761639
    }
  }
})
/* eslint-enable quotes */

describe.skip('rollbar', () => {
  beforeEach(() => {
    this.room = helper.createRoom({ name: 'tests' })
    return co(function * () {
      yield this.room.robot.http('http://localhost:8080/webhook/rollbar/tests')
        .header('Content-Type', 'application/json')
        .post(data)
    }.bind(this))
  })

  afterEach(() => {
    this.room.destroy()
  })

  context('/webhook/rollbar', () => {
    it('sends the rollbar item message', () => {
      expect(this.room.messages).to.eql(['error: testing rollbar integration', 'See: https://rollbar.com/akitaonrails/MinerX/items/4'])
    })
  })
})
