class CommandUtil {
  static commandName(command) {
    return prefix(command) + command.aliases[0];
  }

  static prefix(command) {
    return command.client.options.prefix;
  }
}

module.exports = CommandUtil;
