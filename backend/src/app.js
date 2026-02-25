const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Security + Logging middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (baad mein add honge)
// app.use('/api/assignments', assignmentRoutes);
// app.use('/api/query', queryRoutes);
// app.use('/api/hint', hintRoutes);

const assignmentRoutes = require('./routes/assignmentRoutes');
app.use('/api/assignments', assignmentRoutes);

const queryRoutes = require('./routes/queryRoutes');
app.use('/api/query', queryRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'CipherSQLStudio API',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
const notFound = require('./middleware/notFound');
app.use(notFound);

// Error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;