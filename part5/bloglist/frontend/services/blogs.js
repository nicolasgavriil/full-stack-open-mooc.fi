import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (content) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, content, config);
  return response.data;
};

const like = async (blogId) => {
  const response = await axios.post(`${baseUrl}/${blogId}/likes`);
  return response.data;
};

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  };

  await axios.delete(`${baseUrl}/${blogId}`, config);
};

export default { getAll, create, like, remove, setToken };
