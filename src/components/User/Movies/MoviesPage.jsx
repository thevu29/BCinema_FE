import { useState, useEffect, useRef } from "react";
import {
  Input,
  CloseButton,
  Radio,
  Stack,
  Divider,
  Box,
  Card,
  Image,
  Text,
  Rating,
  LoadingOverlay,
  Group,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";

import {
  getMoviesBySearchService,
  getMoviesNowPlayingService,
  getMoviesUpcomingService,
} from "../../../services/movieService";
import { useDebouncedCallback } from "@mantine/hooks";

function MoviesPage() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("now_playing");
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const searchInputRef = useRef(null);

  const fetchMoviesNowPlaying = async (page) => {
    try {
      const res = await getMoviesNowPlayingService(page);

      if (res.success) {
        setMovies(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoviesUpcoming = async (page) => {
    try {
      const res = await getMoviesUpcomingService(page);

      if (res.success) {
        setMovies(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoviesBySearch = async (page, query) => {
    try {
      const res = await getMoviesBySearchService(page, query);

      if (res.success) {
        setMovies(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page") || 1;
    const query = params.get("search");
    setSearchQuery(query);
    if (query !== null) {
      setSelectedStatus("search");
      fetchMoviesBySearch(page, query);
    } else {
      if (selectedStatus === "now_playing") {
        searchInputRef.current.value = "";
        fetchMoviesNowPlaying(page);
      } else {
        searchInputRef.current.value = "";
        fetchMoviesUpcoming(page);
      }
    }
  }, [location.search, selectedStatus]);

  useEffect(() => {
    // Access the element using the ref
    if (searchInputRef.current) {
      console.log(searchInputRef.current); // Do something with the element
    }
  }, []);

  const handleRadioChange = (status) => {
    setSelectedStatus(status);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    navigate(`?${location.pathname}`);
  };

  const handleSeach = useDebouncedCallback((search) => {
    const params = new URLSearchParams(location.search);

    params.set("search", search);
    params.delete("page");

    if (!search) params.delete("search");

    navigate(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <LoadingOverlay zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <div className="flex flex-row justify-center items-center">
        <Input
          ref={searchInputRef}
          className="w-2/4"
          placeholder="Search movies..."
          onChange={(e) => handleSeach(e.target.value)}
          rightSectionPointerEvents="all"
          mt="md"
          leftSection={
            <IconSearch
              width={18}
              height={18}
            />
          }
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => {
                handleSeach("");
                handleRadioChange("now_playing");
                searchInputRef.current.value = "";
              }}
              style={{ display: searchQuery ? undefined : "none" }}
            />
          }
        />
      </div>
      <Divider
        my="xs"
        variant="dashed"
        labelPosition="center"
        label={
          <>
            <IconSearch size={12} />
            <Box ml={5}>Search results</Box>
          </>
        }
      />
      <div className="flex flex-row justify-start items-start">
        <Radio.Group
          className="ml-10 p-1 w-40"
          value={selectedStatus}
          onChange={handleRadioChange}
        >
          <Stack>
            <Radio
              variant="outline"
              disabled={!searchQuery}
              value={`search`}
              label="Tìm kiếm"
            ></Radio>
            <Radio
              variant="outline"
              value={`now_playing`}
              label="Đang chiếu"
            ></Radio>
            <Radio
              variant="outline"
              value={`upcoming`}
              label="Sắp chiếu"
            ></Radio>
          </Stack>
        </Radio.Group>
        <Divider className="ml-5 mr-10" size="sm" orientation="vertical" />
        {/* Movies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {movies.results && movies.results.length > 0 ? (
            movies.results.map((movie) => (
              <Card
                key={movie.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Text className="text-xl">{movie.title}</Text>
                <Text>
                  <div className="flex flex-col items-center">
                    <Image
                      src={`http://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={`${movie.title} poster`}
                      className="h-12 object-cover rounded-lg mb-4"
                    />
                    <div className="text-center w-full">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {movie.voteCount} lượt đánh giá
                        </span>
                        <span className="text-sm text-gray-600">
                          {movie.runtime} phút
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <Rating
                          value={movie.voteAverage / 2}
                          fractions={2}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </Text>
              </Card>
            ))
          ) : (
            <Text>No movies found</Text>
          )}
        </div>
      </div>
      <Group justify="space-evenly" mt={24} className="p-10">
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

export default MoviesPage;
