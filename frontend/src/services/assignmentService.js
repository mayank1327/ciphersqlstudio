import axios from 'axios';

const API = '/api/assignments';

export const getAllAssignments = async () => {
  const response = await axios.get(API);
  return response.data;
};

export const getAssignmentById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
};