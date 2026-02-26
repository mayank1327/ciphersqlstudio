import axios from 'axios';

export const executeQuery = async (assignmentId, sqlQuery) => {
  const response = await axios.post('/api/query/execute', {
    assignmentId,
    sqlQuery
  });
  return response.data;
};