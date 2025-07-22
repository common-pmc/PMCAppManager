'use strict';
const fs = require ('fs');
const path = require ('path');
const Sequelize = require ('sequelize');

const basename = path.basename (__filename);
const env = process.env.NODE_ENV || 'development';
const config = require (__dirname + '/../config.json')[env];

const db = {};

// Create an instance of Sequelize with the configuration
const sequelize = new Sequelize (config);

// Automatically load all models in the current directory
fs
  .readdirSync (__dirname)
  .filter (file => file.endsWith ('.js') && file !== basename)
  .forEach (file => {
    const model = require (path.join (__dirname, file)) (
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Create associations between models if any
Object.keys (db).forEach (modelName => {
  if (db[modelName].associate) {
    db[modelName].associate (db);
  }
});
