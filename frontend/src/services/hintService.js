import axios from 'axios';

export const getHint = async (assignmentId, sqlQuery) => {
  const response = await axios.post('/api/hint', {
    assignmentId,
    sqlQuery
  });
  return response.data;
};