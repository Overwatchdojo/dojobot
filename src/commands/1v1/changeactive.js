const { Command } = require('discord-akairo');

const { Competitor } = require('../../models/1v1');

const CommandUtil = require('../../util/CommandUtil');

class ChangeActiveCommand extends Command {
  constructor() {
    super('1v1changeactive', {
      aliases: ['1v1changeactive'],
      category: '1v1'
    });
  }

  async exec(message) {
    const competitor = await Competitor.findOne({
      where: {
        userId: message.author.id
      }
    });

    if (!competitor) {
      // If the competitor is not registered, abort
      return message.author.send('You are not a registered League Participant, please refer to !1v1help.');
    } else if (message.channel.type == 'dm') {
      // If the request was a DM, consider it confirmation and change active status
      competitor.active = !competitor.active;
      await competitor.save();
      return message.author.send('Successfully changed active status to '
        + (competitor.active ? 'active' : 'inactive') + '.');
    } else {
      // In all other cases, request confirmation
      return message.author.send('Do you want to change your activity status? If so, please reply with **'
        + CommandUtil.commandName(this) + '**.');
    }
  }
}

module.exports = ChangeActiveCommand;
