const DojoBot = require('./src/struct/DojoBot');
const config = require('./config.json');
const process = require('process');

const bot = new DojoBot(config);

bot.start();

process.on('unhandledRejection', r => console.log(r));
