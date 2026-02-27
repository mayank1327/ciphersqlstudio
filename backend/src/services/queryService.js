const { pool } = require('../config/postgresql');

class QueryService {

  // ==================== SANDBOX SETUP ====================

  // Create isolated schema for each assignment attempt
  async createSandbox(sandboxId) {
    const schemaName = `sandbox_${sandboxId}`;
    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
    return schemaName;
  }

  // Drop sandbox after query executed
  async dropSandbox(schemaName) {
    await pool.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
  }

  // ==================== TABLE SETUP ====================

  // Create tables and insert sample data from assignment
  async setupTables(schemaName, sampleTables) {
    for (const table of sampleTables) {
      // Build CREATE TABLE query dynamically
      const columns = table.columns
        .map(col => `${col.columnName} ${col.dataType}`)
        .join(', ');

      const createQuery = `
        CREATE TABLE ${schemaName}.${table.tableName} (${columns})
      `;
      await pool.query(createQuery);

      // Insert rows if any
      if (table.rows && table.rows.length > 0) {
        for (const row of table.rows) {
          const keys = Object.keys(row);
          const values = Object.values(row);
          const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

          const insertQuery = `
            INSERT INTO ${schemaName}.${table.tableName} 
            (${keys.join(', ')}) 
            VALUES (${placeholders})
          `;
          await pool.query(insertQuery, values);
        }
      }
    }
  }

  // ==================== QUERY SANITIZATION ====================

  // Block dangerous SQL commands
  sanitizeQuery(sqlQuery) {
    // Pehle comments remove karo
    const withoutComments = sqlQuery
      .replace(/--.*$/gm, '')  // single line comments remove karo
      .replace(/\/\*[\s\S]*?\*\//g, '')  // multi line comments remove karo
      .trim();
  
    if (!withoutComments) {
      const error = new Error('Please write a SQL query');
      error.status = 400;
      throw error;
    }
  
    const query = withoutComments.toUpperCase();
  
    const blockedKeywords = [
      'DROP', 'DELETE', 'TRUNCATE', 'INSERT',
      'UPDATE', 'ALTER', 'CREATE', 'GRANT',
      'REVOKE', 'EXEC', 'EXECUTE'
    ];
  
    for (const keyword of blockedKeywords) {
      if (query.startsWith(keyword)) {
        const error = new Error(
          `Query contains blocked keyword: ${keyword}. Only SELECT queries are allowed.`
        );
        error.status = 400;
        error.code = 'BLOCKED_QUERY';
        throw error;
      }
    }
  
    if (!query.startsWith('SELECT') && !query.startsWith('WITH')) {
      const error = new Error('Only SELECT queries are allowed');
      error.status = 400;
      error.code = 'INVALID_QUERY_TYPE';
      throw error;
    }
  
    // Comments removed version return karo
    return withoutComments.trim();
  }

  // ==================== MAIN EXECUTE FUNCTION ====================

  async executeQuery(sqlQuery, sampleTables) {
    // Step 1 — Sanitize query first
    const cleanQuery = this.sanitizeQuery(sqlQuery);

    // Step 2 — Generate unique sandbox ID
    const sandboxId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const schemaName = await this.createSandbox(sandboxId);

    try {
      // Step 3 — Setup tables with sample data
      await this.setupTables(schemaName, sampleTables);

      // Step 4 — Set search path so user can write
      // "SELECT * FROM employees" instead of
      // "SELECT * FROM sandbox_123.employees"
      await pool.query(`SET search_path TO ${schemaName}`);

      // Step 5 — Execute student's query
      const result = await pool.query(cleanQuery);

      // Step 6 — Return results
      return {
        success: true,
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields.map(f => f.name)
      };

    } catch (error) {
      // PostgreSQL query error — return as user error not server error
      return {
        success: false,
        error: error.message,
        rows: [],
        rowCount: 0,
        fields: []
      };

    } finally {
      // Step 7 — ALWAYS drop sandbox, even if query failed
      await this.dropSandbox(schemaName);

      // Reset search path back to default
      await pool.query(`SET search_path TO public`);
    }
  }
}

module.exports = new QueryService();