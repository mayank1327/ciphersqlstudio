const assignmentRepository = require('../repositories/assignmentRepository');

class AssignmentService {

  // Get all assignments for listing page
  async getAllAssignments() {
    const assignments = await assignmentRepository.findAll();

    if (!assignments || assignments.length === 0) {
      const error = new Error('No assignments found');
      error.status = 404;
      throw error;
    }

    return assignments.map(a => ({
      id: a._id,
      title: a.title,
      description: a.description,
      difficulty: a.difficulty,
      createdAt: a.createdAt
    }));
  }

  // Get single assignment full detail (for attempt page)
  async getAssignmentById(id) {
    const assignment = await assignmentRepository.findById(id);

    if (!assignment) {
      const error = new Error('Assignment not found');
      error.status = 404;
      throw error;
    }

    return {
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      difficulty: assignment.difficulty,
      question: assignment.question,
      sampleTables: assignment.sampleTables,
      expectedOutput: assignment.expectedOutput
    };
  }
}

module.exports = new AssignmentService();