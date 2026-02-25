const queryService = require('../services/queryService');
const assignmentService = require('../services/assignmentService');

const executeQuery = async (req, res, next) => {
  try {
    const { sqlQuery, assignmentId } = req.body;

    // Validate input
    if (!sqlQuery || !sqlQuery.trim()) {
      return res.status(400).json({
        success: false,
        error: 'SQL query is required'
      });
    }

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    // Get assignment to fetch sample tables
    const assignment = await assignmentService.getAssignmentById(assignmentId);

    // Execute query in sandbox
    const result = await queryService.executeQuery(
      sqlQuery,
      assignment.sampleTables
    );

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};

module.exports = { executeQuery };