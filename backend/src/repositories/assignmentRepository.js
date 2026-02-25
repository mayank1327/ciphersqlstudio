const Assignment = require('../models/Assignment');

class AssignmentRepository {

  // Get all assignments (only needed fields for listing)
  async findAll() {
    return Assignment.find(
      {},
      { title: 1, description: 1, difficulty: 1, createdAt: 1 }
    ).sort({ createdAt: -1 });
  }

  // Get single assignment with full details
  async findById(id) {
    return Assignment.findById(id);
  }
}

module.exports = new AssignmentRepository();