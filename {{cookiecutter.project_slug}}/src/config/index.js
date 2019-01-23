const config = {};

config.mongodb = {
  url: process.env.DATABASE_URL,
  secret: 'randomStringSport'
};

config.facebook = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL
};

config.google = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
};

config.firebase = {
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_x509_cert_url: process.env.client_x509_cert_url
};

config.aws = {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  bucketName: process.env.AWS_STORAGE_BUCKET_NAME
};

config.jwt = {
  secret: process.env.JWT_SECRET
};

config.app = {
  ROLE: {
    ADMIN: 'ADMIN'
  }
};

export default config;
