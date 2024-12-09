import { useState, useEffect, useCallback } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import {
  getNowPlayingMoviesService,
  searchMoviesService,
} from "../services/movieService";

export const useMovieFetcher = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  const fetchMovies = useCallback(async (query = "", page = 1) => {
    setIsLoading(true);
    try {
      const res = query
        ? await searchMoviesService(query, page)
        : await getNowPlayingMoviesService(page);

      if (res.success) {
        const newMovies = res.data.results.map((movie) => ({
          value: movie.id.toString(),
          label: `${movie.title} (${movie.originalTitle})`,
        }));

        setMovies((prevMovies) =>
          page === 1 ? newMovies : [...prevMovies, ...newMovies]
        );

        setTotalPages(res.data.total_pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery !== undefined) {
      fetchMovies(debouncedQuery, 1);
    }
  }, [debouncedQuery, fetchMovies]);

  const loadMoreMovies = useCallback(() => {
    if (currentPage < totalPages) {
      fetchMovies(debouncedQuery, currentPage + 1);
    }
  }, [currentPage, totalPages, debouncedQuery, fetchMovies]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    loadMoreMovies,
    setSearchQuery,
    isLoading,
    currentPage,
    totalPages,
  };
};
