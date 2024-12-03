import { Tabs, Button, Grid } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieCard from "../Card/MovieCard";
import {
  getNowPlayingMoviesService,
  getUpcomingMoviesService,
} from "../../../../../services/movieService";

const MovieBooking = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [visibleMoviesUpcoming, setVisibleMoviesUpcoming] = useState(8);
  const [visibleMoviesNowPlaying, setVisibleMoviesNowPlaying] = useState(8);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);
  const [loadingNowPlaying, setLoadingNowPlaying] = useState(false);

  const fetchUpcomingMovies = async () => {
    setLoadingUpcoming(true);
    try {
      const response = await getUpcomingMoviesService(1);
      setUpcomingMovies(response.data.results);
    } catch (error) {
      console.error("Failed to fetch upcoming movies:", error);
    } finally {
      setLoadingUpcoming(false);
    }
  };

  const fetchNowPlayingMovies = async () => {
    setLoadingNowPlaying(true);
    try {
      const response = await getNowPlayingMoviesService(1);
      setNowPlayingMovies(response.data.results);
    } catch (error) {
      console.error("Failed to fetch now playing movies:", error);
    } finally {
      setLoadingNowPlaying(false);
    }
  };

  const loadMoreUpcoming = () => {
    setVisibleMoviesUpcoming((prev) => prev + 8);
  };

  const loadMoreNowPlaying = () => {
    setVisibleMoviesNowPlaying((prev) => prev + 8);
  };

  useEffect(() => {
    fetchUpcomingMovies();
    fetchNowPlayingMovies();
  }, []);

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-4 gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-0">
              Đặt vé xem phim
            </h2>
          </div>

          <Link to="/movies">
            <Button
              variant="filled"
              color="indigo"
              radius="xl"
              rightSection={<IconArrowNarrowRight />}
            >
              Xem tất cả
            </Button>
          </Link>
        </div>

        <div className="pt-8 pb-4 mx-4">
          <Tabs defaultValue="upcoming">
            <Tabs.List grow justify="center">
              <Tabs.Tab
                value="upcoming"
                sx={{ fontSize: "18px", fontWeight: "bold" }}
              >
                Phim sắp chiếu
              </Tabs.Tab>
              <Tabs.Tab
                value="nowPlaying"
                sx={{ fontSize: "18px", fontWeight: "bold" }}
              >
                Phim đang chiếu
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="upcoming" pt="md">
              {loadingUpcoming ? (
                <p>Đang tải...</p>
              ) : (
                <Grid gutter="md">
                  {upcomingMovies
                    .slice(0, visibleMoviesUpcoming)
                    .map((movie, index) => (
                      <Grid.Col key={index} span={3}>
                        <MovieCard movie={movie} isNowPlaying={false} />{" "}
                      </Grid.Col>
                    ))}
                </Grid>
              )}
              <Button
                variant="outline"
                color="indigo"
                fullWidth
                mt="md"
                onClick={loadMoreUpcoming}
                disabled={visibleMoviesUpcoming >= upcomingMovies.length}
              >
                Xem thêm
              </Button>
            </Tabs.Panel>

            <Tabs.Panel value="nowPlaying" pt="md">
              {loadingNowPlaying ? (
                <p>Đang tải...</p>
              ) : (
                <Grid gutter="md">
                  {nowPlayingMovies
                    .slice(0, visibleMoviesNowPlaying)
                    .map((movie, index) => (
                      <Grid.Col key={index} span={3}>
                        <MovieCard movie={movie} isNowPlaying={true} />
                      </Grid.Col>
                    ))}
                </Grid>
              )}
              <Button
                variant="outline"
                color="indigo"
                fullWidth
                mt="md"
                onClick={loadMoreNowPlaying}
                disabled={visibleMoviesNowPlaying >= nowPlayingMovies.length}
              >
                Xem thêm
              </Button>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default MovieBooking;
