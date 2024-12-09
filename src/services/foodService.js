import axios from "../utils/axiosCustom";

export const getFoodsService = async ({
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
  const url = `/foods${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getFoodByIdService = async (id) => {
  return await axios.get(`/foods/${id}`);
};

export const getAllFoodsService = async () => {
  const res = await axios.get("/foods/all");
  return res;
};

export const addFoodService = async (formData) => {
  const res = await axios.post("/foods", formData);
  return res;
};

export const updateFoodService = async (id, formData) => {
  const res = await axios.put(`/foods/${id}`, formData);
  return res;
};

export const deleteFoodService = async (id) => {
  const res = await axios.delete(`/foods/${id}`);
  return res;
};
