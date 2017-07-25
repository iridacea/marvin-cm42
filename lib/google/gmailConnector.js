const fs = require('fs')
const readline = require('readline')
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS } = require('../config')
const { google } = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/youtube.readonly'
]
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'lib/token.json'

const userProfile = (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })
  gmail.users.getProfile({ userId: 'me' }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err)
    console.log(res.data)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url:\n', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', code => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err)
        console.log(
          'Token stored to',
          TOKEN_PATH,
          '\n copy the file content to enviroment variabels'
        )
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = callback => {
  const oAuth2Client = new google.auth.OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URIS
  })

  // Generate new Token
  return getNewToken(oAuth2Client, callback)
}

// initiate the authorization proccess
authorize(userProfile)
