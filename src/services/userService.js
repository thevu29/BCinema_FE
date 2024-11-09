import axios from "../utils/axiosCustom";

export const getUsersService = async ({
  search = "",
  role = "",
  page = 1,
  size = 5,
  sortBy,
  order,
}) => {
  const params = new URLSearchParams();
  
  if (search) params.append('search', search);
  if (role) params.append('role', role);
  if (page) params.append('page', page);
  if (size) params.append('size', size);
  if (sortBy) params.append('sortBy', sortBy);
  if (order) params.append('order', order);

  const queryString = params.toString();
  const url = `/users${queryString ? `?${queryString}` : ''}`;
  
  const res = await axios.get(url);
  return res;
};

export const getUserByIdService = async (id) => {
  return await axios.get(`/users/${id}`);
};

export const addUserService = async (formData) => {
  const res = await axios.post("/users", formData);
  return res;
};

export const updateUserService = async (id, formData) => {
  const res = await axios.put(`/users/update/${id}`, formData);
  return res;
}

export const deleteUserService = async (id) => {
  const res = await axios.delete(`/users/delete/${id}`);
  return res;
}
