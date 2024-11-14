import axios from "../utils/axiosCustom";

export const getRoomsService = async ({
  search = "",
  page = 1,
  size = 5,
  sortBy,
  sortOrder,
}) => {
  const params = new URLSearchParams();
  
  if (search) params.append('search', search);
  if (page) params.append('page', page);
  if (size) params.append('size', size);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const queryString = params.toString();
  const url = `/rooms${queryString ? `?${queryString}` : ''}`;
  
  const res = await axios.get(url);
  return res;
};

export const getRoomByIdService = async (id) => {
  return await axios.get(`/rooms/${id}`);
};

export const addRoomService = async (formData) => {
  const res = await axios.post("/rooms", formData);
  return res;
};

export const updateRoomService = async (id, formData) => {
  const res = await axios.put(`/rooms/${id}`, formData);
  return res;
}

export const deleteRoomService = async (id) => {
  const res = await axios.delete(`/rooms/${id}`);
  return res;
}
