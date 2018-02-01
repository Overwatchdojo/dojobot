const { Command } = require('discord-akairo');

const CommandUtil = require('../../util/CommandUtil');

const name = '1v1help';

class HelpCommand extends Command {
  constructor() {
    super(name, {
      aliases: [ name ],
      category: '1v1'
    });
  }

  async exec(message) {
    return message.author.send('Help goes here.');
  }
}

HelpCommand.commandName = name;

module.exports = HelpCommand;
