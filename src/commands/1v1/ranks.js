const { Command } = require('discord-akairo');
const { Competitor, Match, MatchStates } = require('../../models/1v1');
const StatsUtil = require('../../util/1v1/StatsUtil');
const UserUtil = require('../../util/1v1/UserUtil');

const CommandUtil = require('../../util/CommandUtil');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const _ = require('lodash');

const name = '1v1ranks';

// How many top rankers to show, note that with ties more can be actually displayed
const SHOW_RANKS = 4;

class RanksCommand extends Command {
  constructor() {
    super(name, {
      aliases: [ name ],
      category: '1v1'
    });
  }

  async exec(message) {
/*
Both SP and AP for all users could be selected in a single SQL query like this for better performance:

SELECT
  competitors.userId,
  COUNT(*) AS activityPoints,
  SUM(
    CASE
      WHEN matches.winnerId = competitors.userId THEN 100
      WHEN matches.winnerId IS NULL THEN 33
      ELSE 0 END) AS skillPoints
  FROM competitors, matches
  WHERE
    matches.matchState = 'validated'
    AND (matches.challengerId = competitors.userId OR matches.challengedId = competitors.userId)
  GROUP BY competitors.userId;
*/

    const competitors = await Competitor.findAll();
    const points = await Promise.all(
      competitors.map(async competitor => {
        const stats = await StatsUtil.statsFor(competitor);
        return {
          competitor: competitor,
          skillPoints: stats.skillPoints,
          activityPoints: stats.activityPoints
        };
      }));

    // Creates sorted array of arrays of players at that rank as ranked by given function
    const groupBy = (data, fn) => _.chain(data).groupBy(item => fn(item)).values().sortBy(item => -fn(item[0])).value();

    // Sets given key in all of the items in each item of values to the index of the items in values
    const setRank = (ranked, key) => _.forEach(ranked, (values, index) => _.forEach(values, item => item[key] = index));

    setRank(groupBy(points, item => item.activityPoints), 'activityRank');
    setRank(groupBy(points, item => item.skillPoints), 'skillRank');

    // Group by activityRank + skillRank and sort in ascending order
    const finalGroups = groupBy(points, item => -(item.activityRank + item.skillRank));

    // Assign final rank to everyone, considering ties
    var lastRank = 0;
    for (const group of finalGroups) {
      _.forEach(group, item => item.finalRank = lastRank + 1);
      lastRank += _.size(group);
    }

    const finalRanks = _.flatten(finalGroups);

    var msg = 'Top of the leaderboard:\n';

    const rankString = async ranker => {
      const user = await this.client.users.get(ranker.competitor.userId);
      return '  ' + ranker.finalRank + ') **' + UserUtil.describeUser(message.channel, user)
        + '** (SP: ' + ranker.skillPoints + ', AP: ' + ranker.activityPoints + ')\n';
    };

    // Grab players at ranks 1 to <SHOW_RANKS> (including tied)
    for (const topRanker of _.takeWhile(finalRanks, item => item.finalRank <= SHOW_RANKS)) {
      msg += await rankString(topRanker);
    }

    // Find rank for the user himself if he has one and is not in top <SHOW_RANKS>
    const userRank = _.find(finalRanks, item => item.competitor.userId === message.author.id);
    if (userRank && userRank.finalRank > SHOW_RANKS) {
      msg += 'Your rank:\n';
      msg += await rankString(userRank);
    }

    return message.channel.send(msg);
  }
}

RanksCommand.commandName = name;

module.exports = RanksCommand;
