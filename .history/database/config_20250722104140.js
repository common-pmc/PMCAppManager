module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database/AppManager.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory',
  },
  production: {},
};
