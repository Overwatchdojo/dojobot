const { Command } = require('discord-akairo');
const { Competitor, Match, MatchStates } = require('../../models/1v1');
const MatchDisputeCommand = require('./matchdispute');
const MatchConfirmCommand = require('./matchconfirm');
const HelpCommand = require('./help');

const CommandUtil = require('../../util/CommandUtil');

const UserUtil = require('../../util/1v1/UserUtil');

const name = '1v1matchregister';

class MatchRegisterCommand extends Command {
  constructor() {
    super(name, {
      aliases: [ name ],
      category: '1v1',
      args : [
        {
          id: 'challengedUser',
          type: 'user'
        },
        {
          id: 'result',
          type: 'string'
        }
      ]
    });
  }

  async exec(message, { challengedUser, result }) {
    const helpCmd = CommandUtil.prefix(this) + HelpCommand.commandName;

    const challenger = await Competitor.findOne({ where: { userId: message.author.id } });

    if (!challenger) {
      // If the competitor is not registered, abort
      return message.author.send('You are not a registered League Participant, please refer to **'
        + helpCmd + '**.');
    }

    if (!challengedUser || !result) {
      // If arguments are bad, abort
      return message.author.send('Invalid arguments, please see **' + helpCmd + '**.');
    }

    if (message.author.id == challengedUser.id) {
      // Trying to challenge oneself
      // XXX Can this even happen, I think you can't @mention yourself?
      return message.author.send('You tried to register a match with yourself, that is not allowed!');
    }

    const challenged = await Competitor.findOne({ where: { userId: challengedUser.id } });

    if (!challenged) {
      // Challenged user is not a league participant
      return message.author.send('You tried to register a match with a non-registered user, please try again!\n'
        + 'The other party needs to register as League Participant first so you can log the match.');
    }

    var winnerId;
    var challengedResult;
    if (result == 'win') {
      winnerId = challenger.userId;
      challengedResult = 'your loss';
    } else if (result == 'loss') {
      winnerId = challenged.userId;
      challengedResult = 'your win';
    } else if (result == 'draw') {
      winnerId = null;
      challengedResult = 'draw'
    } else {
      return message.author.send('Result of the match cannot be recognized, please try again!');
    }

    const match = await Match.create({
      matchState: MatchStates.PENDING,
      challengerId: challenger.userId,
      challengedId: challenged.userId,
      winnerId: winnerId
    });

    const withPrefix = (msg) => CommandUtil.prefix(this) + msg;

    await challengedUser.send('**' + UserUtil.describeUser(message.channel, message.author)
      + ' registered a match against you with ID = **' + match.matchId + '** resulting in *' + challengedResult
      + '*.\n'
      + 'To confirm the result, please reply with **' + withPrefix(MatchConfirmCommand.commandName) + '**\n'
      + 'To dispute the result, please reply with **' + withPrefix(MatchDisputeCommand.commandName) + '**');

    return message.author.send('Match versus **' + UserUtil.describeUser(message.channel, challengedUser)
      + '** registered with ID = ' + match.matchId + '.');
  }
}

MatchRegisterCommand.commandName = name;

module.exports = MatchRegisterCommand;
