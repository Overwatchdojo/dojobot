const Sequelize = require('sequelize');

const { db } = require('../struct/Database');

const MatchStates = {
  PENDING: 'pending',
  DISPUTED: 'disputed',
  VALIDATED: 'validated'
}

function makeModels() {
  const Competitor = db.define('competitor', {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    },

    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  const Match = db.define('match', {
    matchId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: true,
      autoIncrement: true
    },

    matchState: {
      type: Sequelize.ENUM(Object.values(MatchStates)),
      allowNull: false
    }
  });
  Match.belongsTo(Competitor, {
    as: 'Challenger',
    foreignKey: { name: 'challengerId', allowNull: false }
  });
  Match.belongsTo(Competitor, {
    as: 'Challenged',
    foreignKey: { name: 'challengedId', allowNull: false }
  });
  Match.belongsTo(Competitor, { as: 'Winner', foreignKey: 'winnerId' });

  return { Competitor: Competitor, Match: Match, MatchStates: MatchStates };
}

module.exports = makeModels();
