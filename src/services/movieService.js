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
