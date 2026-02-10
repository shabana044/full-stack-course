// src/services/persons.js
import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons'; // your backend URL

// Get all persons
const getAll = () => {
  return axios.get(baseUrl).then(res => res.data);
};

// Add a new person
const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(res => res.data);
};

// Update existing person's number
const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data);
};

// Delete a person
const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(res => res.data);
};

// Export all functions
export default { getAll, create, update, remove };
