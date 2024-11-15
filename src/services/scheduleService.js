import axios from "../utils/axiosCustom";

export const getSchedulesService = async ({
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
  const url = `/schedules${queryString ? `?${queryString}` : ''}`;
  
  const res = await axios.get(url);
  return res;
};

export const getScheduleByIdService = async (id) => {
  return await axios.get(`/schedules/${id}`);
};

export const addScheduleService = async (formData) => {
  const res = await axios.post("/schedules", formData);
  return res;
};

export const updateScheduleService = async (id, formData) => {
  const res = await axios.put(`/schedules/${id}`, formData);
  return res;
}

export const deleteScheduleService = async (id) => {
  const res = await axios.delete(`/schedules/${id}`);
  return res;
}
