const Sequelize = require('sequelize');

const { db } = require('../struct/Database');

/*
const Match = db.define('match', {
  id: {
    // int unique autoincrement
  },
  competitor1: {
    // fk competitor
  },
  competitor2: {
    // fk competitor
  },
  timestamp: {
    // datetime
  },
  winner: {
    // fk competitor or null
  },
  state: {
    // enum (pending, validated, disputed)
  }
});
*/

module.exports = {
  Competitor: db.define('competitor', {
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
  })
}
