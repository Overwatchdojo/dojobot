const { Command } = require('discord-akairo');
const { Competitor, Match, MatchStates } = require('../../models/1v1');

const CommandUtil = require('../../util/CommandUtil');

const UserUtil = require('../../util/1v1/UserUtil');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const name = '1v1matches';

class MatchesCommand extends Command {
  constructor() {
    super(name, {
      aliases: [ name ],
      category: '1v1'
    });
  }

  async exec(message) {
    // Find up to five latest validated matches
    const matches = await Match.findAll({
      where: { matchState: MatchStates.VALIDATED },
      order: [ ['createdAt', 'DESC'] ],
      limit: 5
    });

    if (matches.length == 0) {
      return message.channel.send('There seems to be no registered matches!');
    }

    var msg = 'Here are the latest matches:\n';
    for (const match of matches) {
      const describeUser = user => UserUtil.describeUser(message.channel, user);
      const challenger = await this.client.users.get(match.challengerId);
      const challenged = await this.client.users.get(match.challengedId);
      const result = match.winnerId
        ?  'winner=**' + describeUser(await this.client.users.get(match.winnerId)) + '**'
        : 'draw';
      msg += '  -  Time: ' + match.createdAt + ' ID=' + match.matchId + ' challenger=**' + describeUser(challenger)
        + '** challenged=**' + describeUser(challenged) + '** ' + result + '\n';
    }

    return message.channel.send(msg);
  }
}

MatchesCommand.commandName = name;

module.exports = MatchesCommand;
