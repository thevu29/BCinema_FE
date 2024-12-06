import { useState, useEffect, useRef } from "react";
import {
  CloseButton,
  Radio,
  Stack,
  Text,
  LoadingOverlay,
  Group,
  TextInput,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";
import MovieCard from "../Home/Content/Card/MovieCard";
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

  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    try {
      const res = await getMoviesUpcomingService(page);

      if (res.success) {
        setMovies(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoviesBySearch = async (page, query) => {
    setIsLoading(true);

    try {
      const res = await getMoviesBySearchService(page, query);

      if (res.success) {
        setMovies(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const handleRadioChange = (status) => {
    setSelectedStatus(status);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    params.delete("search");
    navigate(`${location.pathname}`);
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
      <LoadingOverlay
        zIndex={1000}
        visible={movies.length === 0}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-5">
          <div className="flex flex-col col-span-2 border-slate-300 border-r-[1px] pt-8">
            <div className="flex items-center">
              <ThemeIcon variant="white" c="black">
                <IconFilter style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
              <Text className="text-lg md:text-xl font-bold mb-0">Lọc</Text>
            </div>
            <Radio.Group
              className="p-1 w-40 py-6"
              value={selectedStatus}
              onChange={handleRadioChange}
            >
              <Stack>
                <Radio
                  variant="outline"
                  disabled={!searchQuery}
                  value={`search`}
                  label="Tìm kiếm"
                />
                <Radio
                  variant="outline"
                  value={`now_playing`}
                  label="Đang chiếu"
                />
                <Radio variant="outline" value={`upcoming`} label="Sắp chiếu" />
              </Stack>
            </Radio.Group>
          </div>

          <div className="col-span-10">
            <div className="flex flex-row justify-end items-center mb-5">
              <TextInput
                ref={searchInputRef}
                className="w-2/4 mt-8"
                placeholder="Tìm phim"
                onChange={(e) => handleSeach(e.target.value)}
                rightSectionPointerEvents="all"
                leftSection={<IconSearch width={18} height={18} />}
                rightSection={
                  <CloseButton
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

            <Box pos="relative">
              <LoadingOverlay
                zIndex={1000}
                visible={isLoading}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {movies &&
                  movies.results &&
                  movies.results.length > 0 &&
                  movies.results.map((movie) => {
                    const isNowPlaying =
                      selectedStatus === "now_playing" ||
                      selectedStatus === "search";

                    return (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isNowPlaying={isNowPlaying}
                      />
                    );
                  })}
              </div>

              <Group justify="center" my={24}>
                <PaginationComponent
                  currentPage={movies?.page || 1}
                  totalPages={movies?.totalPages || 1}
                />
              </Group>

              {movies.results && movies.results.length === 0 && (
                <Text className="text-center my-10">
                  Không tìm thấy phim nào
                </Text>
              )}
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoviesPage;
