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

    const prompt = `You are a friendly SQL tutor helping a beginner student.

    ASSIGNMENT QUESTION:
    ${question}
    
    AVAILABLE TABLE STRUCTURE:
    ${tableContext}
    
    STUDENT'S CURRENT QUERY:
    ${sqlQuery || 'Student has not written anything yet'}
    
    ANALYZE the student's query and give a hint based on these cases:
    
    CASE 1 - Student wrote nothing or just comment:
    → Tell them which SQL clause to START with
    
    CASE 2 - Student wrote partial query (only SELECT):
    → Tell them what's MISSING next (WHERE/GROUP BY/JOIN etc.)
    
    CASE 3 - Student wrote wrong logic:
    → Point out specifically what concept they're missing
    
    RULES:
    - Maximum 2 sentences
    - Never write SQL code
    - Never give the answer
    - Be specific to THEIR query, not generic
    - Use simple English, student is a beginner

    IMPORTANT RULE:
    - If student is using ORDER BY + LIMIT approach, 
      warn them it might miss tied values
    - Guide them toward MAX() or subquery approach
    
    Your hint:`;
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