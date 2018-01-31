const { AkairoClient } = require('discord-akairo');
const Database = require('./Database');
const path = require('path');

class DojoBot extends AkairoClient {
  constructor(config) {
    super({
      ownerID: config.ownerID,
      prefix: config.prefix,
      commandDirectory: path.join(__dirname, '..', 'commands')
    });
    this.config = config;
  }

  async start() {
    await Database.init();
    await this.login(this.config.token);
  }
}

module.exports = DojoBot;
