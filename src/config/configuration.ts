export default () => ({
  port: +process.env.PORT || 3000,
  allowed_origins: process.env.ALLOWED_ORIGINS,
  mongodb: {
    uri: process.env.MONGO_URI,
  },
  jwtSecret: process.env.JWT_SECRET,
  node_env: process.env.NODE_ENV,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET,
    region: process.env.AWS_REGION,
  },
  discord: {
    url: process.env.DISCORD_WEBHOOK_URL,
    name: process.env.DISCORD_WEBHOOK_USERNAME,
  },
});
