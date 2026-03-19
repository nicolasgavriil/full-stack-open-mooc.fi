import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newPerson) => {
  return axios.post("http://localhost:3001/persons", newPerson);
};

const remove = (id) => {
  return axios.delete(`http://localhost:3001/persons/${id}`);
};

export default { getAll, create, remove };
