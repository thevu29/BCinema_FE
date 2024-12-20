import axios from "../utils/axiosCustom";

export const getMoviesNowPlayingService = async (page) => {
  return await axios.get(`/movies/now-playing/${page}`);
};

export const getMoviesUpcomingService = async (page) => {
  return await axios.get(`/movies/upcoming/${page}`);
};

export const getMovieByIdService = async (id) => {
  return await axios.get(`/movies/${id}`);
};

export const getMoviesBySearchService = async (page = 1, query = "") => {
  return await axios.get(`/movies?query=${query}&page=${page}`);
};

export const searchMoviesService = async (query = "", page = 1) => {
  return axios.get(`/movies?query=${query}&page=${page}`);
};

export const getNowPlayingMoviesService = async (page = 1) => {
  return axios.get(`/movies/now-playing/${page}`);
};

export const getUpcomingMoviesService = async (page = 1) => {
  return axios.get(`/movies/upcoming/${page}`);
};
