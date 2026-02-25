require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('../src/models/Assignment');
const connectMongoDB = require('../src/config/mongodb');

const assignments = [
  {
    title: 'Find All Employees',
    description: 'Practice basic SELECT query to fetch all records from a table',
    difficulty: 'Easy',
    question: 'Write a SQL query to fetch all employees from the employees table.',
    sampleTables: [
      {
        tableName: 'employees',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'TEXT' },
          { columnName: 'department', dataType: 'TEXT' },
          { columnName: 'salary', dataType: 'REAL' }
        ],
        rows: [
          { data: { id: 1, name: 'Rahul Sharma', department: 'Engineering', salary: 75000 } },
          { data: { id: 2, name: 'Priya Patel', department: 'Marketing', salary: 55000 } },
          { data: { id: 3, name: 'Amit Singh', department: 'Engineering', salary: 80000 } },
          { data: { id: 4, name: 'Neha Gupta', department: 'HR', salary: 50000 } },
          { data: { id: 5, name: 'Raj Kumar', department: 'Marketing', salary: 60000 } }
        ]
      }
    ],
    expectedOutput: {
      type: 'table',
      value: [
        { id: 1, name: 'Rahul Sharma', department: 'Engineering', salary: 75000 },
        { id: 2, name: 'Priya Patel', department: 'Marketing', salary: 55000 },
        { id: 3, name: 'Amit Singh', department: 'Engineering', salary: 80000 },
        { id: 4, name: 'Neha Gupta', department: 'HR', salary: 50000 },
        { id: 5, name: 'Raj Kumar', department: 'Marketing', salary: 60000 }
      ]
    }
  },
  {
    title: 'High Salary Employees',
    description: 'Practice WHERE clause to filter records based on conditions',
    difficulty: 'Easy',
    question: 'Write a SQL query to find all employees whose salary is greater than 60000.',
    sampleTables: [
      {
        tableName: 'employees',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'TEXT' },
          { columnName: 'department', dataType: 'TEXT' },
          { columnName: 'salary', dataType: 'REAL' }
        ],
        rows: [
          { data: { id: 1, name: 'Rahul Sharma', department: 'Engineering', salary: 75000 } },
          { data: { id: 2, name: 'Priya Patel', department: 'Marketing', salary: 55000 } },
          { data: { id: 3, name: 'Amit Singh', department: 'Engineering', salary: 80000 } },
          { data: { id: 4, name: 'Neha Gupta', department: 'HR', salary: 50000 } },
          { data: { id: 5, name: 'Raj Kumar', department: 'Marketing', salary: 60000 } }
        ]
      }
    ],
    expectedOutput: {
      type: 'table',
      value: [
        { id: 1, name: 'Rahul Sharma', department: 'Engineering', salary: 75000 },
        { id: 3, name: 'Amit Singh', department: 'Engineering', salary: 80000 }
      ]
    }
  },
  {
    title: 'Count Employees Per Department',
    description: 'Practice GROUP BY with aggregate functions',
    difficulty: 'Medium',
    question: 'Write a SQL query to count the number of employees in each department.',
    sampleTables: [
      {
        tableName: 'employees',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'TEXT' },
          { columnName: 'department', dataType: 'TEXT' },
          { columnName: 'salary', dataType: 'REAL' }
        ],
        rows: [
          { data: { id: 1, name: 'Rahul Sharma', department: 'Engineering', salary: 75000 } },
          { data: { id: 2, name: 'Priya Patel', department: 'Marketing', salary: 55000 } },
          { data: { id: 3, name: 'Amit Singh', department: 'Engineering', salary: 80000 } },
          { data: { id: 4, name: 'Neha Gupta', department: 'HR', salary: 50000 } },
          { data: { id: 5, name: 'Raj Kumar', department: 'Marketing', salary: 60000 } }
        ]
      }
    ],
    expectedOutput: {
      type: 'table',
      value: [
        { department: 'Engineering', count: 2 },
        { department: 'Marketing', count: 2 },
        { department: 'HR', count: 1 }
      ]
    }
  },
  {
    title: 'Customer Orders Join',
    description: 'Practice INNER JOIN to combine data from two tables',
    difficulty: 'Medium',
    question: 'Write a SQL query to fetch customer names along with their order amounts using JOIN.',
    sampleTables: [
      {
        tableName: 'customers',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'TEXT' },
          { columnName: 'city', dataType: 'TEXT' }
        ],
        rows: [
          { data: { id: 1, name: 'Rohit Verma', city: 'Delhi' } },
          { data: { id: 2, name: 'Sita Devi', city: 'Mumbai' } },
          { data: { id: 3, name: 'Karan Mehta', city: 'Pune' } }
        ]
      },
      {
        tableName: 'orders',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'customer_id', dataType: 'INTEGER' },
          { columnName: 'amount', dataType: 'REAL' },
          { columnName: 'order_date', dataType: 'DATE' }
        ],
        rows: [
          { data: { id: 1, customer_id: 1, amount: 1500, order_date: '2024-01-15' } },
          { data: { id: 2, customer_id: 2, amount: 2300, order_date: '2024-01-16' } },
          { data: { id: 3, customer_id: 1, amount: 800, order_date: '2024-01-17' } },
          { data: { id: 4, customer_id: 3, amount: 3200, order_date: '2024-01-18' } }
        ]
      }
    ],
    expectedOutput: {
      type: 'table',
      value: [
        { name: 'Rohit Verma', amount: 1500 },
        { name: 'Sita Devi', amount: 2300 },
        { name: 'Rohit Verma', amount: 800 },
        { name: 'Karan Mehta', amount: 3200 }
      ]
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectMongoDB();

    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log('🗑️  Cleared existing assignments');

    // Insert new assignments
    await Assignment.insertMany(assignments);
    console.log(`✅ Seeded ${assignments.length} assignments successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();