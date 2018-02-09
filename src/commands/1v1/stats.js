const { Command } = require('discord-akairo');
const { Competitor, Match, MatchStates } = require('../../models/1v1');

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

    // WHERE constraint that only matches validated games where competitor was participating
    const matchParticipantWhere = {
      [Op.or]: [
        { challengerId: competitor.userId },
        { challengedId: competitor.userId }
      ],
      matchState: MatchStates.VALIDATED
    };

    // Technically it's possible to count all three match stats in one SQL query but Sequelize doesn't offer any way of
    // doing it without using raw query, fix later if performance is actually a problem
    const numPlayed = await Match.count({ where: matchParticipantWhere });

    const combine = (a, b) => Object.assign({}, a, b);

    const numWon = await Match.count({
      where: combine(matchParticipantWhere, {
        winnerId: competitor.userId,
      })
    });

    const numDrawn = await Match.count({
      where: combine(matchParticipantWhere, {
        winnerId: null,
      })
    });

    const activityPoints = numPlayed;
    const skillPoints = numWon * 100 + numDrawn * 33;

    return message.channel.send(
      'Here are the stats for ' + user.toString() + ':\n'
      + 'Matches played: ' + numPlayed + '\n'
      + 'Matches won: ' + numWon + '\n'
      + 'SP: ' + skillPoints + '\n'
      + 'AP: ' + activityPoints);
  }
}

StatsCommand.commandName = name;

module.exports = StatsCommand;
