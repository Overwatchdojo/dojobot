const { Command } = require('discord-akairo');

const { Competitor } = require('../../models/1v1');

const CommandUtil = require('../../util/CommandUtil');

class RegisterCommand extends Command {
  constructor() {
    super('1v1register', {
      aliases: ['1v1register'],
      category: '1v1'
    });
  }

  async exec(message) {
    const competitor = await Competitor.findOne({
      where: {
        userId: message.author.id
      }
    });

    if (competitor) {
      // If the competitor is already registered, abort
      return message.author.send('You are already registered as a League Participant.');
    } else if (message.channel.type == 'dm') {
      // If the request was a DM, consider it confirmation and create user
      Competitor.create({
        userId: message.author.id
      });
      return message.author.send('Successfully registered as League Participant.');
    } else {
      // In all other cases, request confirmation
      return message.author.send('Do you want to register as new League Participant? If so, please reply with **'
        + CommandUtil.commandName(this) + '**.');
    }
  }
}

module.exports = RegisterCommand;
