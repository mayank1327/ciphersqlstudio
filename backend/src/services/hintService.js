const Groq = require('groq-sdk');
const config = require('../config');

const groq = new Groq({ apiKey: config.GROQ_API_KEY });

class HintService {

  async getHint(question, sqlQuery, sampleTables) {

    const tableContext = sampleTables.map(table => {
      const columns = table.columns
        .map(col => `${col.columnName} (${col.dataType})`)
        .join(', ');
      return `Table "${table.tableName}": ${columns}`;
    }).join('\n');

    const prompt = `You are a SQL tutor helping a student learn SQL.

ASSIGNMENT QUESTION:
${question}

AVAILABLE TABLES:
${tableContext}

STUDENT'S CURRENT QUERY:
${sqlQuery || 'Student has not written any query yet'}

YOUR TASK:
Give a SHORT hint (2-3 sentences maximum) that:
- Guides the student's thinking in right direction
- Points to which SQL concept they should use
- Does NOT reveal the actual solution or write any SQL code
- Is encouraging and educational

STRICT RULES:
- Never write the complete SQL query
- Never show the expected output
- Keep hint under 3 sentences
- Be specific to their current query if they wrote one

Hint:`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        max_tokens: 150,
        temperature: 0.7,
      });

      const hint = completion.choices[0].message.content.trim();
      return { hint };

    } catch (error) {
      console.error('Groq Error:', error);

      if (error.status === 429) {
        const err = new Error('Hint service is busy. Please try again in a minute.');
        err.status = 429;
        throw err;
      }

      const err = new Error('Failed to generate hint. Please try again.');
      err.status = 500;
      throw err;
    }
  }
}

module.exports = new HintService();