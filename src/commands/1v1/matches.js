const { Command } = require('discord-akairo');
const { Competitor, Match, MatchStates } = require('../../models/1v1');

const CommandUtil = require('../../util/CommandUtil');

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

  async exec(message, { user }) {
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
      const challenger = await this.client.users.get(match.challengerId);
      const challenged = await this.client.users.get(match.challengedId);
      const result = match.winnerId ? 'winner=' + await this.client.users.get(match.winnerId).toString() : 'draw';
      msg += '  -  Time: ' + match.createdAt + ' ID=' + match.matchId + ' challenger=' + challenger.toString()
        + ' challenged=' + challenged.toString() + ' ' + result + '\n';
    }

    return message.channel.send(msg);
  }
}

MatchesCommand.commandName = name;

module.exports = MatchesCommand;
