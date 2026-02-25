const hintService = require('../services/hintService');
const assignmentService = require('../services/assignmentService');

const getHint = async (req, res, next) => {
  try {
    const { assignmentId, sqlQuery } = req.body;

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    // Get assignment details for context
    const assignment = await assignmentService.getAssignmentById(assignmentId);

    // Get hint from LLM
    const result = await hintService.getHint(
      assignment.question,
      sqlQuery || '',
      assignment.sampleTables
    );

    res.status(200).json({
      success: true,
      hint: result.hint
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getHint };