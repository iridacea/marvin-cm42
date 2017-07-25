// Commands:
//   hubot omnitrade markets - List all available markets and it's prices
//   hubot omnitrade price <market> - Show the market price for the given coin

require('numeral/locales/pt-br')
const numeral = require('numeral')

numeral.locale('pt-br')

const formatPrice = (value) => numeral(value).format('$0,0.00')
const formatMarket = (market) => `${market.slice(0, 3)}/${market.slice(3, 6)}`.toUpperCase()

module.exports = (robot) => {
  const uri = 'https://omnitrade.io/api/v2/'

  robot.hear(/omnitrade markets/i, res => {
    robot.http(`${uri}tickers.json`).get()((err, resp, body) => {
      if (err) return res.send(`Encountered an error :( ${err}`)
      const data = JSON.parse(body)
      let reply = ''

      for (var market in data) {
        reply += `${formatMarket(market)}: ${formatPrice(data[market].ticker.last)}\n`
      }

      res.send(`\`\`\`${reply}\`\`\``)
    })
  })

  robot.hear(/omnitrade price (.*)/i, res => {
    const market = res.match[1]

    robot.http(`${uri}tickers/${market}.json`).get()((err, resp, body) => {
      if (err) return res.send(`Encountered an error :( ${err}`)
      const data = JSON.parse(body)

      if (resp.statusCode !== 200) {
        res.send('Sorry. Can\'t find a market with that name.')
      } else {
        res.send(`\`\`\`${formatMarket(market)}: ${formatPrice(data.ticker.last)}\`\`\``)
      }
    })
  })
}
