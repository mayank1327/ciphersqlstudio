const validate = (schema, property = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false
    });
  
    if (error) {
      const messages = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message;
        return acc;
      }, {});
  
      return res.status(400).json({
        success: false,
        errors: messages
      });
    }
  
    req[property] = value;
    next();
  };
  
  module.exports = validate;