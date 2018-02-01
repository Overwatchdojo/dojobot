const { Command } = require('discord-akairo');

const { Competitor } = require('../../models/1v1');

const CommandUtil = require('../../util/CommandUtil');

class MatchRegisterCommand extends Command {
  constructor() {
    super('1v1matchregister', {
      aliases: ['1v1matchregister'],
      category: '1v1',
      args : [
        {
          id: 'challenged',
          type: 'user'
        },
        {
          id: 'result',
          type: 'string'
        }
      ]
    });
  }

  async exec(message, { challenged, result }) {
    const competitor = await Competitor.findOne({
      where: {
        userId: message.author.id
      }
    });

    if (!competitor) {
      // If the competitor is not registered, abort
      return message.author.send('You are not a registered League Participant, please refer to !1v1help.');
    } else {
      console.log('challenged: ' + challenged);
      console.log('result: ' + result);
    }
  }
}

module.exports = MatchRegisterCommand;
