import axios from "../utils/axiosCustom";

export const getSchedulesService = async ({
  movieId = "",
  search = "",
  date = "",
  roomId = "",
  page = 1,
  size = 5,
  sortBy,
  sortOrder,
}) => {
  const params = new URLSearchParams();

  if (movieId) params.append("movieId", movieId);
  if (search) params.append("search", search);
  if (date) params.append("date", date);
  if (roomId) params.append("roomId", roomId);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  const queryString = params.toString();
  const url = `/schedules${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getAllSchedulesService = async () => {
  return await axios.get("/schedules/all");
};

export const getScheduleByIdService = async (id) => {
  return await axios.get(`/schedules/${id}`);
};

export const addScheduleService = async (data) => {
  const res = await axios.post("/schedules", data);
  return res;
};

export const autoAddScheduleService = async (data) => {
  return await axios.post("/schedules/auto-create", data);
};

export const updateScheduleService = async (id, data) => {
  const res = await axios.put(`/schedules/${id}`, data);
  return res;
};

export const deleteScheduleService = async (id) => {
  const res = await axios.delete(`/schedules/${id}`);
  return res;
};
