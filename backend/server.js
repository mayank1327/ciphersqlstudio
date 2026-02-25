const app = require('./src/app');
const config = require('./src/config');
const connectMongoDB = require('./src/config/mongodb');
const { connectPostgreSQL } = require('./src/config/postgresql');

const startServer = async () => {
  try {
    // Connect both databases first
    await connectMongoDB();
    await connectPostgreSQL();

    // Start server only after both DBs connected
    app.listen(config.PORT, () => {
      console.log(`🚀 Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();