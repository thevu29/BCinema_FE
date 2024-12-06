import { Tabs, Button, Grid, Group, LoadingOverlay } from "@mantine/core";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieCard from "../Card/MovieCard";
import {
  getNowPlayingMoviesService,
  getUpcomingMoviesService,
} from "../../../../../services/movieService";

const MovieBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  const fetchUpcomingMovies = async () => {
    setIsLoading(true);
    try {
      const response = await getUpcomingMoviesService(1);
      setUpcomingMovies(response.data.results);
    } catch (error) {
      console.error("Failed to fetch upcoming movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNowPlayingMovies = async () => {
    setIsLoading(true);
    try {
      const response = await getNowPlayingMoviesService(1);
      setNowPlayingMovies(response.data.results);
    } catch (error) {
      console.error("Failed to fetch now playing movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMovies();
    fetchNowPlayingMovies();
  }, []);

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto">
        <div className="pt-8 pb-4 mx-4 relative">
          {isLoading ? (
            <LoadingOverlay
              visible={isLoading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : (
            <>
              <Tabs defaultValue="now-playing" variant="outline">
                <Tabs.List grow justify="center">
                  <Tabs.Tab
                    value="now-playing"
                    className="font-semibold"
                    style={{ fontSize: 16 }}
                  >
                    Phim đang chiếu
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="upcoming"
                    className="font-semibold"
                    style={{ fontSize: 16 }}
                  >
                    Phim sắp chiếu
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="now-playing" pt="md">
                  {nowPlayingMovies && nowPlayingMovies.length > 0 && (
                    <Grid gutter="md">
                      {nowPlayingMovies.slice(0, 8).map((movie, index) => (
                        <Grid.Col key={index} span={3}>
                          <MovieCard movie={movie} isNowPlaying={true} />
                        </Grid.Col>
                      ))}
                    </Grid>
                  )}
                </Tabs.Panel>

                <Tabs.Panel value="upcoming" pt="md">
                  {upcomingMovies && upcomingMovies.length > 0 && (
                    <Grid gutter="md">
                      {upcomingMovies.slice(0, 8).map((movie, index) => (
                        <Grid.Col key={index} span={3}>
                          <MovieCard movie={movie} isNowPlaying={false} />{" "}
                        </Grid.Col>
                      ))}
                    </Grid>
                  )}
                </Tabs.Panel>
              </Tabs>

              <Group justify="center">
                <Link to="/movies">
                  <Button variant="filled" color="indigo" mt="md">
                    Xem tất cả
                  </Button>
                </Link>
              </Group>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MovieBooking;
