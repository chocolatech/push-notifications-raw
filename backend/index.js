const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000
app.get('/', (req, res) => res.send('Hello World!'))
const dummyDb = { subscription: null } //dummy in memory store
const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  const subscription = req.body
  await saveToDatabase(subscription) //Method to save the subscription to Database
  console.log('Subscription saved in BE!')
  res.json({ message: 'success' })
})
const vapidKeys = {
  publicKey:
    'BBxPtM6fQs6k3A5nMeYbwWvaXVvZdMWJTOZmafge67eXi9oXcX9wzLwzUSefSqmgA9WPgctLvdg0-zRrSEPAxGw',
  privateKey: 'C4u5IwM7zSXE9zvixorWWwMqV_kn0R__S5o3eV5m5_c',
}
//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

//route to test send notification
app.get('/send-notification', (req, res) => {
  try {
    const subscription = dummyDb.subscription //get subscription from your databse here.
    const message = 'Hello World'
    if (subscription) {
      webpush.sendNotification(subscription, message)
      res.json({ message: 'message sent' })
    }
    else {
      res.json({ message: 'message not sent' })
    }
  } catch (error) {

  }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))