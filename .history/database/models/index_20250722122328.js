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
fs.readdirSync (__dirname);
