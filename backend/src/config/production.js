module.exports = {
  port: process.env.PORT || 10000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  nodeEnv: 'production'
};

