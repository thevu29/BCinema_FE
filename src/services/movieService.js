import axios from "../utils/axiosCustom";

export const searchMoviesService = async (query = "", page = 1) => {
  return axios.get(`/movies?query=${query}&page=${page}`);
};

export const getNowPlayingMoviesService = async (page = 1) => {
  return axios.get(`/movies/now-playing/${page}`);
};

export const getUpcomingMoviesService = async (page = 1) => {
  return axios.get(`/movies/upcoming/${page}`);
}
