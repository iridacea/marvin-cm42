const { CLIENT_ID, CLIENT_SECRET, token } = require('../config')
const { google } = require('googleapis')

const authenticate = () => {
  const oAuth2Client = new google.auth.OAuth2(
    {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    }
  )

  oAuth2Client.setCredentials(token)
  return oAuth2Client
}

module.exports = { authenticate }
