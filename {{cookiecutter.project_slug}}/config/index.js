const config = {}

config.mongodb = {
  url: process.env.DATABASE_URL,
  secret: 'randomStringSport'
}

config.facebook = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}

config.google = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}

config.app = {
  ROLE: {
    ADMIN: 'ADMIN'
  }
}

module.exports = config