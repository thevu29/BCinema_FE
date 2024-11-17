import axios from "../utils/axiosCustom";


export const getAllRoles = async () => {
  const res = await axios.get("/roles/all");
  return res;
};

export const getRolesService = async ({
  search = "",
  page = 1,
  size = 5,
  sortBy,
  sortOrder,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  const queryString = params.toString();
  const url = `/roles${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getRoleServiceById = async (id) => {
  const res = await axios.get(`/roles/${id}`);
  return res;
};

export const addRoleService = async (data) => {
  const res = await axios.post("/roles", data);
  return res;
};

export const updateRoleService = async (id, data) => {
  const res = await axios.put(`/roles/${id}`, data);
  return res;
};

export const deleteRoleService = async (id) => {
  const res = await axios.delete(`/roles/${id}`);
  return res;
};
