import axios from "../utils/axiosCustom";

export const getAllSeatTypesService = async () => {
  return await axios.get("/seat-types/all");
};

export const getSeatTypesService = async ({
  search = "",
  price = "",
  page = 1,
  size = 5,
  sortBy,
  sortOrder,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (price) params.append("price", price);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  const queryString = params.toString();
  const url = `/seat-types${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getSeatTypeByIdService = async (id) => {
  return await axios.get(`/seat-types/${id}`);
};

export const addSeatTypeService = async (data) => {
  return await axios.post("/seat-types", data);
};

export const updateSeatTypeService = async (id, data) => {
  return await axios.put(`/seat-types/${id}`, data);
};

export const deleteSeatTypeService = async (id) => {
  return await axios.delete(`/seat-types/${id}`);
};
