module.exports = (robot) => {
  const channels = (robot.adapter.client) ? robot.adapter.client.channels : []
  const types = { 10: 'Debug', 20: 'Info', 30: 'Warning', 40: 'Error', 50: 'Critical' }
  const hasName = name => c => c.name === name

  const findChannelsByName = (name, channels) => channels.find(hasName(name))

  robot.router.post('/webhook/rollbar/:room', (req, res) => {
    const room = findChannelsByName(req.params.room, channels)
    const item = req.body.data.item

    if (item.environment === 'production') {
      item.level = types[item.level]

      robot.messageRoom(
        room.id,
        `${item.level}: ${item.title}`,
        `See: https://rollbar.com/akitaonrails/MinerX/items/${item.counter}`,
        ''
      )
    }

    res.set('Content-Type', 'text/plain')
    res.send('OK')
  })
}
