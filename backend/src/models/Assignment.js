const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  columnName: {
    type: String,
    required: true,
    trim: true
  },
  dataType: {
    type: String,
    required: true,
    enum: ['INTEGER', 'TEXT', 'REAL', 'BOOLEAN', 'DATE', 'TIMESTAMP']
  }
}, { _id: false });

const sampleTableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  columns: [columnSchema],
  rows: {
    type: [mongoose.Schema.Types.Mixed],  // Direct array of objects
    default: []
  }
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty is required']
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  sampleTables: [sampleTableSchema],
  
  expectedOutput: {
    type: {
      type: String,
      enum: ['table', 'single_value', 'column', 'count'],
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  }
}, { timestamps: true});

module.exports = mongoose.model('Assignment', assignmentSchema);