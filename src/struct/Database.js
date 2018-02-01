const Sequelize = require('sequelize');
const path = require('path');
const readdir = require('util').promisify(require('fs').readdir);

const { dbConfig } = require('../../config.json');

const db = new Sequelize(dbConfig);

class Database {
  static get db() {
    return db;
  }

  static async init() {
    await db.authenticate();
    
    const modelsPath = path.join(__dirname, '..', 'models');
    const files = await readdir(modelsPath);

    for (const file of files) {
      const filePath = path.join(modelsPath, file);
      if (filePath.startsWith('.') || !filePath.endsWith('.js'))
        continue;
      await require(filePath);
    }

    return db.sync();
  }
}

module.exports = Database;
