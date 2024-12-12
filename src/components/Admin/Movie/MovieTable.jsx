import {
  Table,
  Group,
  Image,
  LoadingOverlay,
  Select,
  Menu,
  Button,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IconFilter } from "@tabler/icons-react";
import {
  getMoviesNowPlayingService,
  getMoviesUpcomingService,
  getMoviesBySearchService,
} from "../../../services/movieService";
import PaginationComponent from "../../Pagination/Pagination";

const statuses = [
  { value: "now_playing", label: "Now Playing" },
  { value: "upcoming", label: "Upcoming" },
];

import { formatDate } from "../../../utils/date";

function MovieTable() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("now_playing");
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangeStatus = (status) => {
    setSelectedStatus(status);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    navigate(`?${location.pathname}`);
  };

  const fetchMoviesNowPlaying = async (page) => {
    try {
      const res = await getMoviesNowPlayingService(page);

      if (res.success) {
        setMovies(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoviesUpcoming = async (page) => {
    try {
      const res = await getMoviesUpcomingService(page);

      if (res.success) {
        setMovies(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoviesBySearch = async (page, query) => {
    try {
      const res = await getMoviesBySearchService(page, query);

      if (res.success) {
        setMovies(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page") || 1;
    const query = params.get("search");
    setSearchQuery(query);
    if (query !== null) {
      fetchMoviesBySearch(page, query);
    } else {
      if (selectedStatus === "now_playing") {
        fetchMoviesNowPlaying(page);
      } else {
        fetchMoviesUpcoming(page);
      }
    }
  }, [location.search, selectedStatus]);

  const rows =
    movies.results &&
    movies.results.length > 0 &&
    movies.results.map((movie) => (
      <Table.Tr key={movie.id}>
        <Table.Td>{movie.title}</Table.Td>
        <Table.Td>
          <Image
            className="h-36"
            src={`http://image.tmdb.org/t/p/w500${movie.posterPath}`}
          />
        </Table.Td>
        <Table.Td>
          {movie.genres.map((genre) => {
            return genre.name + ", ";
          })}
        </Table.Td>
        <Table.Td>{formatDate(movie.releaseDate)}</Table.Td>
        <Table.Td>{movie.runtime}</Table.Td>
        {!searchQuery && (
          <Table.Td>
            {statuses.map((status) => {
              return status.value === selectedStatus ? status.label : "";
            })}
          </Table.Td>
        )}
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
              <Group>
                <span>Runtime (minutes)</span>
              </Group>
            </Table.Th>
            {!searchQuery && (
              <Table.Th className="cursor-pointer hover:bg-slate-50">
                <Group>
                  <span>Status</span>
                </Group>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button variant="white" color="rgba(0, 0, 0, 1)" size="xs">
                      <IconFilter width={18} height={18} />
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Select
                      data={statuses}
                      allowDeselect
                      value={selectedStatus}
                      onChange={handleChangeStatus}
                      maw={150}
                    />
                  </Menu.Dropdown>
                </Menu>
              </Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="center" mt={24}>
        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={movies?.totalPages || 1}
        />
      </Group>
    </>
  );
}

export default MovieTable;
