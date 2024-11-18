import axios from "../utils/axiosCustom";

export const getAllUsersService = async () => {
  return await axios.get("/users/all");
}

export const getUsersService = async ({
  search = "",
  role = "",
  page = 1,
  size = 5,
  sortBy,
  sortOrder,
}) => {
  const params = new URLSearchParams();
  
  if (search) params.append('search', search);
  if (role) params.append('role', role);
  if (page) params.append('page', page);
  if (size) params.append('size', size);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

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
  const res = await axios.put(`/users/${id}`, formData);
  return res;
}

export const deleteUserService = async (id) => {
  const res = await axios.delete(`/users/${id}`);
  return res;
}
