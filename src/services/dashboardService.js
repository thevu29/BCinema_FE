import axios from "../utils/axiosCustom";

export const getRevenueService = async ({ month, year }) => {
  const params = new URLSearchParams();

  if (month) params.append("month", month);
  if (year) params.append("year", year);

  const queryString = params.toString();
  const url = `/payments/revenue${queryString ? `?${queryString}` : ""}`;

  return await axios.get(url);
};

export const getTopMoviesService = async ({ month, year, count = 5 }) => {
  const params = new URLSearchParams();

  if (month) params.append("month", month);
  if (year) params.append("year", year);
  if (count) params.append("count", count);

  const queryString = params.toString();
  const url = `/payments/top-movies${queryString ? `?${queryString}` : ""}`;

  return await axios.get(url);
};

export const getUserRegistrationService = async ({ month, year }) => {
  const params = new URLSearchParams();

  if (month) params.append("month", month);
  if (year) params.append("year", year);

  const queryString = params.toString();
  const url = `/users/registration${queryString ? `?${queryString}` : ""}`;

  return await axios.get(url);
};
