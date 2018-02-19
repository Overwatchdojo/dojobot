const { Competitor, Match, MatchStates } = require('../../models/1v1');

const CommandUtil = require('../../util/CommandUtil');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class StatsUtil {
  static async statsFor(competitor) {
    // WHERE constraint that only matches validated games where competitor was participating
    const matchParticipantWhere = {
      [Op.or]: [
        { challengerId: competitor.userId },
        { challengedId: competitor.userId }
      ],
      matchState: MatchStates.VALIDATED
    };

    const combine = (a, b) => Object.assign({}, a, b);

    const numPlayed = await Match.count({ where: matchParticipantWhere });
    const numWon = await Match.count({ where: combine(matchParticipantWhere, { winnerId: competitor.userId, }) });
    const numDrawn = await Match.count({ where: combine(matchParticipantWhere, { winnerId: null, }) });

    const activityPoints = numPlayed;
    const skillPoints = numWon * 100 + numDrawn * 33;

    return {
      gamesPlayed: numPlayed,
      gamesWon: numWon,
      skillPoints: skillPoints,
      activityPoints: activityPoints
    };
  }
}

module.exports = StatsUtil;
