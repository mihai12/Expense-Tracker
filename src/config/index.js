const logger = require('pino')({ prettyPrint: true });
require('dotenv').config();

module.exports = {
  database: {
    dsn: 'mongodb+srv://expenseTrackerUser:S8OIwMmaasce4qMm@cluster0.io1rn.mongodb.net/Cluster0?retryWrites=true&w=majority',
    status: {
      connected: false,
      error: false,
    },
  },
  logger
};
