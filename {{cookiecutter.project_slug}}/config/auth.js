// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': '118716022099611', // your App ID
        'clientSecret': '117f6ec89fd55fa241e39dbd363e5d13', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'provider_clientId': '130039404285867',
        'provider_clientSecret': 'd6937a10cd737166c64ca071afd6926a'
    },

    'twitterAuth': {
        'consumerKey': 'your-consumer-key-here',
        'consumerSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': '573003519734-ncs71ekrq1mj26001nr9f2ht8lhlqruj.apps.googleusercontent.com',
        'clientSecret': 'cMXawZTc_oyII2SB7f2JjAzG',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    },
    'linkedIn': {
        'clientID': '81q8q306y37rfe',
        'clientSecret': 'w1g3Lgh7CcdYrYE1',
        'callbackURL': 'http://localhost:3000/auth/linkedIn/callback'
    },

    geocoding: {
        apiKey: 'AIzaSyD3f79dWbuM4XVwSJ75d9Jh6DumAudK4lc'
    },
    TWILIO_API_KEY: process.env.TWILIO_API_KEY
};
