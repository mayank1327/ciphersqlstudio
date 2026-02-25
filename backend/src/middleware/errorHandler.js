const errorHandler = (err, req, res, next) => {
    console.error('🔥 Error:', err.message);
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
  
    // Duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue);
      return res.status(409).json({
        success: false,
        error: `${field} already exists`
      });
    }
  
    // Default error
    res.status(err.statusCode || err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error'
    });
  };
  
  module.exports = errorHandler;