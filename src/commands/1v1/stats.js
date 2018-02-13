const { Command } = require('discord-akairo');
const { Competitor, Match, MatchStates } = require('../../models/1v1');
const StatsUtil = require('../../util/1v1/StatsUtil');

const CommandUtil = require('../../util/CommandUtil');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const name = '1v1stats';

class StatsCommand extends Command {
  constructor() {
    super(name, {
      aliases: [ name ],
      category: '1v1',
      args: [
        {
          id: 'user',
          type: 'user'
        }
      ]
    });
  }

  async exec(message, { user }) {
    const competitor = await Competitor.findOne({ where: { userId: user.id } });

    if (!competitor) {
      // Requested user is not registered as a competitor, abort
      return message.channel.send('You tried to get statistics for a non-existing user, please try again!');
    }

    const stats = await StatsUtil.statsFor(competitor);

    return message.channel.send(
      'Here are the stats for ' + user.toString() + ':\n'
      + 'Matches played: ' + stats.gamesPlayed + '\n'
      + 'Matches won: ' + stats.gamesWon + '\n'
      + 'SP: ' + stats.skillPoints + '\n'
      + 'AP: ' + stats.activityPoints);
  }
}

StatsCommand.commandName = name;

module.exports = StatsCommand;
