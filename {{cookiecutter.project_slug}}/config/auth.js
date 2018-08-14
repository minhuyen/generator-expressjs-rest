// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth': {
    'clientID': 'your-app-id', // your App ID
    'clientSecret': 'your-app-secret', // your App Secret
    'callbackURL': 'http://localhost:3000/auth/facebook/callback',
    'provider_clientId': 'your-provider-id',
    'provider_clientSecret': 'your-provider-secret'
  },

  'twitterAuth': {
    'consumerKey': 'your-consumer-key-here',
    'consumerSecret': 'your-client-secret-here',
    'callbackURL': 'http://localhost:3000/auth/twitter/callback'
  },

  'googleAuth': {
    'clientID': 'your-client-id',
    'clientSecret': 'your-client-secret',
    'callbackURL': 'http://localhost:3000/auth/google/callback'
  },
  'linkedIn': {
    'clientID': 'your-client-id',
    'clientSecret': 'your-client-secret',
    'callbackURL': 'http://localhost:3000/auth/linkedIn/callback'
  },

  'geocoding': {
    'apiKey': 'your-api-key'
  }
};
