const { Command } = require('discord-akairo');
const { Competitor, Match, MatchStates } = require('../../models/1v1');
const HelpCommand = require('./help');

const CommandUtil = require('../../util/CommandUtil');

const name = '1v1matchconfirm';

class MatchConfirmCommand extends Command {
  constructor() {
    super(name, {
      aliases: [ name ],
      category: '1v1',
      args: [
        {
          id: 'matchId',
          type: 'integer'
        }
      ]
    });
  }

  async exec(message, { matchId }) {
    const challenged = await Competitor.findOne({ where: { userId: message.author.id } });

    if (!challenged) {
      // If the competitor is not registered, abort
      return message.author.send('You are not a registered League Participant, please refer to **'
        + CommandUtil.prefix(this) + HelpCommand.commandName + '**.');
    }

    const match = await Match.findOne({ where: { matchId: matchId } });

    if (!match || match.challengedId != message.author.id || match.matchState != MatchStates.PENDING) {
      // Invalid match id or not the challenged user of the match
      return message.author.send('Invalid match ID, please try again!');
    }

    match.matchState = MatchStates.VALIDATED;
    await match.save();

    return message.author.send('Match validated, thank you!');
  }
}

MatchConfirmCommand.commandName = name;

module.exports = MatchConfirmCommand;
