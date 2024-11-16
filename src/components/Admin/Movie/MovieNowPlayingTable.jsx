import {
  Image,
  LoadingOverlay,
  Table,
  Group,
} from "@mantine/core";
import { useState, useEffect } from "react";
import {
  getMoviesNowPlayingService,
  getMovieByIdService,
} from "../../../services/movieService";

import PaginationComponent from "../../Pagination/Pagination";
import { useLocation } from "react-router-dom";


const MovieNowPlayingTable = () => {
  const [movies, setMovies] = useState([]);
  const [moviesVN, setMoviesVN] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchMovies = async (page) => {
      try {
        // Fetch movies
        const moviesRes = await getMoviesNowPlayingService(page);

        if (moviesRes.success) {
          setMovies(moviesRes.data);
          await fetchMoviesById(moviesRes.data.results);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const params = new URLSearchParams(location.search);
    const page = params.get("page") || 1;
    fetchMovies(page);
  }, [location.search]);

  const fetchMoviesById = async (movies) => {
    try {
      // Fetch movies
      for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const movieRes = await getMovieByIdService(movie.id);

        if (movieRes.success) {
          movies[i] = movieRes.data;
        }
        setMoviesVN({ ...movies, results: movies });
      }
    } catch (error) {
      console.error(error);
    }
  };


  const rows = moviesVN.results && moviesVN.results.length > 0 && moviesVN.results.map((movie) => (
    <Table.Tr
        key={movie.id}
      >
        <Table.Td>{movie.title}</Table.Td>
        <Table.Td><Image src={movie.posterPath} /></Table.Td>
        <Table.Td>{movie.genres.map((genre) => {
          return genre.name + ", ";
        })}</Table.Td>
        <Table.Td>{movie.releaseDate}</Table.Td>
        <Table.Td>{movie.voteAverage}</Table.Td>
        <Table.Td>{movie.voteCount}</Table.Td>
        <Table.Td>{movie.runtime}</Table.Td>
      </Table.Tr>
    
  ));
  return (
    <>
      <LoadingOverlay zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="cursor-pointer hover:bg-slate-50">
              <Group justify="space-between">
                <span>Title</span>
              </Group>
            </Table.Th>
            <Table.Th className="cursor-pointer hover:bg-slate-50">
              <Group justify="space-between">
                <span>Poster</span>
              </Group>
            </Table.Th>
            <Table.Th className="cursor-pointer hover:bg-slate-50">
              <Group justify="space-between">
                <span>Genres</span>
              </Group>
            </Table.Th>
            <Table.Th className="cursor-pointer hover:bg-slate-50">
              <Group>
                <span>Release date</span>
              </Group>
            </Table.Th>
            <Table.Th className="cursor-pointer hover:bg-slate-50">
              <Group justify="space-between">
                <span>Vote average</span>
              </Group>
            </Table.Th>
            <Table.Th className="cursor-pointer hover:bg-slate-50">
              <Group>
                <span>Vote count</span>
              </Group>
            </Table.Th>
            <Table.Th className="cursor-pointer hover:bg-slate-50">
              <Group>
                <span>Runtime (minutes)</span>
              </Group>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={movies?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default MovieNowPlayingTable;
