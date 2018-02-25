const { Command } = require('discord-akairo');

const CommandUtil = require('../../util/CommandUtil');
const RegisterCommand = require('./register');
const ChangeActiveCommand = require('./changeactive');
const MatchesCommand = require('./matches');
const StatsCommand = require('./stats');
const RanksCommand = require('./ranks');
const MatchRegisterCommand = require('./matchregister');
const MatchConfirmCommand = require('./matchconfirm');
const MatchDisputeCommand = require('./matchdispute');


const name = '1v1help';

class HelpCommand extends Command {
  constructor() {
    super(name, {
      aliases: [ name ],
      category: '1v1'
    });
  }

  async exec(message) {
    let msg = "Here is a list of commands you can use with me:\n" +
    "*(For full rules: <http://overwatchdojo.com/1v1league/)>*\n" +
    "`" + CommandUtil.prefix(this) + HelpCommand.commandName + "`" +
    "\n\t\t\tDisplay this help message\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + HelpCommand.commandName + "`\n\n" +
    "------------ Personal ----------------\n\n" +
    "`" + CommandUtil.prefix(this) + RegisterCommand.commandName + "`" +
    "\n\t\t\tRegister as a League Participant\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + RegisterCommand.commandName + "`\n\n" +
    "`" + CommandUtil.prefix(this) + ChangeActiveCommand.commandName + "`" +
    "\n\t\t\tFlip active status. This will keep your stats, just makes you inactive/active!\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + ChangeActiveCommand.commandName + "`\n\n" +
    "------------ Global ----------------\n\n" +
    "`" + CommandUtil.prefix(this) + MatchesCommand.commandName + "`" +
    "\n\t\t\tList recent 5 matches.\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + MatchesCommand.commandName + "`\n\n" +
    "`" + CommandUtil.prefix(this) + RanksCommand.commandName + "`" +
    "\n\t\t\tGet the current top of the leaderboards\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + RanksCommand.commandName + "`\n\n" + 
    "------------ Matches ----------------\n\n" +
    "`" + CommandUtil.prefix(this) + StatsCommand.commandName + " <userMention>`" +
    "\n\t\t\tList a player's statistics. Note that you need to use the full user name without the @ mention!\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + StatsCommand.commandName + " alienteavend|overwatchdojo#6615`\n\n" +
    "`" + CommandUtil.prefix(this) + MatchRegisterCommand.commandName + " <userMention> <result=win/loss/draw>`" +
    "\n\t\t\tIndicate that you finished a match with <userMention>. Note that you need to use the full user name without the @ mention!" +
    "\n\t\t\tYou should input YOUR result (eg: if you win, use win,etc.)\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + MatchRegisterCommand.commandName + " alienteavend|overwatchdojo#6615 win`\n\n" +
    "`" + CommandUtil.prefix(this) + MatchConfirmCommand.commandName + " <matchId>`" +
    "\n\t\t\tConfirm match result reported by another user" +
    "\n\t\t\tYou will get a notification if someone reports a match with you, just use this command to confirm or see the dispute command.\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + MatchConfirmCommand.commandName + " 231`\n\n" +
    "`" + CommandUtil.prefix(this) + MatchDisputeCommand.commandName + " <matchId>`" +
    "\n\t\t\tIndicate that you want to dispute a match result. Please also message an admin to make sure we get notified!\n" +
    "\t\t\tExample: `" + CommandUtil.prefix(this) + MatchDisputeCommand.commandName + " 231`\n\n";
    return message.author.send(msg);
  }
}

HelpCommand.commandName = name;

module.exports = HelpCommand;
