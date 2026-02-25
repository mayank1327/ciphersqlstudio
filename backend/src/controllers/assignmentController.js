const assignmentService = require('../services/assignmentService');

const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAllAssignments();
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await assignmentService.getAssignmentById(id);
    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById
};