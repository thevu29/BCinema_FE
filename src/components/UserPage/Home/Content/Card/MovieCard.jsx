import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
  Paper,
  Modal,
} from "@mantine/core";
import { useState } from "react";
import { IconTicket } from "@tabler/icons-react";
import { getSchedulesService } from "../../../../../services/scheduleService";

const MovieCard = ({ movie, isNowPlaying }) => {
  const [hovered, setHovered] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const openModal = () => {
    setSelectedMovie(movie);
    setModalOpened(true);
    fetchSchedules(movie.id);
  };

  const closeModal = () => {
    setModalOpened(false);
    setSelectedMovie(null);
  };

  const fetchSchedules = async (movieId) => {
    setLoadingSchedules(true);
    try {
      const response = await getSchedulesService({ movieId });
      setSchedules(response.data || []);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };


  return (
    <>
      <Card
        padding="lg"
        radius="md"
        style={{
          width: 270,
          transition: "transform 0.2s",
          position: "relative",
          overflow: "hidden",
        }}
        sx={{
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Card.Section style={{ position: "relative" }}>
          <Image
            src={`http://image.tmdb.org/t/p/w500${movie.posterPath}`}
            height={200}
            alt={movie.title}
            style={{
              transition: "opacity 0.3s ease",
              opacity: hovered ? 0.6 : 1,
            }}
          />
          {hovered && isNowPlaying && (
            <Paper
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              shadow="xs"
            >
              <Button
                variant="light"
                color="yellow"
                size="md"
                onClick={openModal}
              >
                <IconTicket size={16} style={{ marginRight: 5 }} />
                Mua vé
              </Button>
            </Paper>
          )}
        </Card.Section>

        <Group position="apart" mt="lg">
          <Text fw={700} size="lg">
            {movie.title}
          </Text>
        </Group>

        <Badge color={"yellow"}>{movie.originalLanguage}</Badge>

        <Group position="apart" mt="xs">
          <Text size="sm" color="gray">
            Điểm: {movie.voteAverage.toFixed(1)} / 10
          </Text>
        </Group>

        <Text size="sm" mt="xs">
          Thời lượng: {movie.runtime} phút
        </Text>
        <Text size="sm" mt="xs">
          Ngày khởi chiếu: {new Date(movie.releaseDate).toLocaleDateString()}
        </Text>
      </Card>

      {modalOpened && selectedMovie && (
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title={selectedMovie.title}
          size="70%"
          centered
        >
          <h3>Lịch chiếu</h3>
          {loadingSchedules ? (
            <p>Đang tải lịch chiếu...</p>
          ) : (
            <div>
              {schedules.length > 0 ? (
                schedules.map((scheduleItem) => (
                  <Paper key={scheduleItem.movieId} withBorder p="md" mb="md">
                    <Group position="apart">
                      <Text>
                        <strong>Phim:</strong> {scheduleItem.movieName}
                      </Text>
                      <Text>
                        <strong>Ngày:</strong>{" "}
                        {new Date(scheduleItem.date).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Text mt="xs">
                      <strong>Phòng:</strong> {scheduleItem.roomName}
                    </Text>
                    <Text mt="xs">
                      <strong>Suất chiếu:</strong>
                    </Text>
                    <ul>
                      {scheduleItem.schedules.map((schedule) => (
                        <li key={schedule.id}>
                          <Group>
                            <Text>Giờ: {schedule.time}</Text>
                            <Badge
                              color={
                                schedule.status === "Ended" ? "red" : "green"
                              }
                            >
                              {schedule.status}
                            </Badge>
                          </Group>
                        </li>
                      ))}
                    </ul>
                  </Paper>
                ))
              ) : (
                <Text color="dimmed">Hiện không có lịch chiếu nào</Text>
              )}
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default MovieCard;
