class CommandUtil {
  static commandName(command) {
    return command.client.options.prefix + command.aliases[0];
  }
}

module.exports = CommandUtil;
