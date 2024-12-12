import axios from "../utils/axiosCustom";

export const getPaymentsService = async ({
  search = "",
  userId,
  date,
  page = 1,
  size = 5,
  sortBy,
  sortOrder,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (userId) params.append("userId", userId);
  if (date) params.append("date", date);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  const queryString = params.toString();
  const url = `/payments${queryString ? `?${queryString}` : ""}`;

  return await axios.get(url);
};

export const getPaymentsHasPointService = async ({
  search = "",
  userId,
  date,
  page = 1,
  size = 5,
  sortBy,
  sortOrder,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (userId) params.append("userId", userId);
  if (date) params.append("date", date);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);
  const hasPoint = "true";
  params.append("hasPoint", hasPoint);

  const queryString = params.toString();
  const url = `/payments${queryString ? `?${queryString}` : ""}`;

  return await axios.get(url);
};

export const addPaymentService = async (data) => {
  return axios.post("/payments", data);
};

export const momoBankingUrlService = async (paymentId) => {
  return axios.post("/payments/momo", { paymentId });
};

export const getTotalPointInYearOfUserService = async (userId, year) => {
  return axios.get(`/payments/total-points-user?userId=${userId}&year=${year}`);
}