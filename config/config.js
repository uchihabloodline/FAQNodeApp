const config = {};

config.appSettings = {
  port: 3000,
  maintenance: false,
  logging: true,
  loggerPath: `${__dirname}/../logs`,
  httpType: 'http',
  maxCookieAge: (1000 * 60 * 100),
  MongoStore_disabled: 'disabled',
  env: 'DEVELOPMENT',
};

module.exports = config;
