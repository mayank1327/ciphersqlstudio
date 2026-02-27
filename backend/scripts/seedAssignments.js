require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('../src/models/Assignment');
const connectMongoDB = require('../src/config/mongodb');

const assignments = [
  {
    title: "Find High Salary Employees",
    description: "Filter employees based on a salary condition using the WHERE clause",
    difficulty: "Easy",
    question: "List all employees earning more than 50,000",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" },
          { columnName: "salary", dataType: "INTEGER" },
          { columnName: "department", dataType: "TEXT" }
        ],
        rows: [
          { id: 1, name: "Alice", salary: 45000, department: "HR" },
          { id: 2, name: "Bob", salary: 60000, department: "Engineering" },
          { id: 3, name: "Charlie", salary: 75000, department: "Engineering" },
          { id: 4, name: "Diana", salary: 48000, department: "Sales" }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 2, name: "Bob", salary: 60000, department: "Engineering" },
        { id: 3, name: "Charlie", salary: 75000, department: "Engineering" }
      ]
    }
  },
  {
    title: "Department-wise Employee Count",
    description: "Count employees in each department using GROUP BY and COUNT aggregate function",
    difficulty: "Medium",
    question: "Find the number of employees in each department",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" },
          { columnName: "department", dataType: "TEXT" }
        ],
        rows: [
          { id: 1, name: "Alice", department: "HR" },
          { id: 2, name: "Bob", department: "Engineering" },
          { id: 3, name: "Charlie", department: "Engineering" },
          { id: 4, name: "Diana", department: "Sales" },
          { id: 5, name: "Eve", department: "Sales" }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { department: "HR", count: 1 },
        { department: "Engineering", count: 2 },
        { department: "Sales", count: 2 }
      ]
    }
  },
  {
    title: "Total Order Value per Customer",
    description: "Combine two tables using JOIN and calculate total order value with SUM function",
    difficulty: "Medium",
    question: "Find total order value for each customer",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" }
        ],
        rows: [
          { id: 1, name: "Aman" },
          { id: 2, name: "Saurabh" }
        ]
      },
      {
        tableName: "orders",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "amount", dataType: "REAL" }
        ],
        rows: [
          { id: 1, customer_id: 1, amount: 1200.5 },
          { id: 2, customer_id: 1, amount: 800.0 },
          { id: 3, customer_id: 2, amount: 1500.0 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { name: "Aman", total_amount: 2000.5 },
        { name: "Saurabh", total_amount: 1500.0 }
      ]
    }
  },
  {
    title: "Highest Paid Employee",
    description: "Find maximum salary using subquery or MAX function with WHERE filtering",
    difficulty: "Hard",
    question: "Find the employee(s) with the highest salary",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" },
          { columnName: "salary", dataType: "INTEGER" }
        ],
        rows: [
          { id: 1, name: "Alice", salary: 70000 },
          { id: 2, name: "Bob", salary: 85000 },
          { id: 3, name: "Charlie", salary: 85000 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 2, name: "Bob", salary: 85000 },
        { id: 3, name: "Charlie", salary: 85000 }
      ]
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectMongoDB();
    await Assignment.deleteMany({});
    console.log('🗑️  Cleared existing assignments');
    await Assignment.insertMany(assignments);
    console.log(`✅ Seeded ${assignments.length} assignments successfully`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();