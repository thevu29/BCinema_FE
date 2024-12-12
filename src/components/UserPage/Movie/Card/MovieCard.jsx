import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
  Paper,
  Modal,
  Tabs,
  Divider,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconTicket } from "@tabler/icons-react";
import { getSchedulesService } from "../../../../services/scheduleService";
import { formatDate, formatDateForApi } from "../../../../utils/date";
import { useAuth } from "../../../../context/Auth/authContext";
import { showNotification } from "../../../../utils/notification";

const today = formatDateForApi(new Date());

const MovieCard = ({ movie, isNowPlaying }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

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
      const response = await getSchedulesService({
        movieId,
        date: `>${today}`,
      });
      setSchedules(response.data.reverse());
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleClickSchedule = (scheduleId) => {
    if (!token) {
      showNotification("Vui lòng đăng nhập để tiếp tục", "Warning");
      navigate("/login");
      return;
    }

    navigate(`/schedules/${scheduleId}/seats`);
  };

  return (
    <>
      <Card
        padding="lg"
        radius="md"
        style={{
          width: 250,
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
            alt={movie.title}
            style={{
              transition: "opacity 0.3s ease",
              opacity: hovered ? 0.6 : 1,
              height: 400,
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
              <Button color="yellow" size="md" onClick={openModal}>
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
          <Text size="sm" c="gray">
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
          title={"Lịch chiếu - " + selectedMovie.title}
          size="70%"
          centered
        >
          {schedules && schedules.length === 0 ? (
            <p>Không có lịch chiếu nào.</p>
          ) : loadingSchedules ? (
            <p>Đang tải lịch chiếu...</p>
          ) : (
            <Tabs defaultValue={schedules[0].date}>
              <Tabs.List>
                {schedules.length > 0 &&
                  schedules.map((scheduleItem) => {
                    const uniqueDates = new Set();

                    if (!uniqueDates.has(scheduleItem.date)) {
                      uniqueDates.add(scheduleItem.date);

                      return (
                        <Tabs.Tab
                          key={scheduleItem.date}
                          value={scheduleItem.date}
                        >
                          {formatDate(scheduleItem.date)}
                        </Tabs.Tab>
                      );
                    }

                    return null;
                  })}
              </Tabs.List>

              {schedules.length > 0 &&
                schedules
                  .sort((a, b) => a.roomName.localeCompare(b.roomName))

                  .map((scheduleItem) => (
                    <div key={`${scheduleItem.date}-${scheduleItem.roomName}`}>
                      <Tabs.Panel value={scheduleItem.date} mt="md">
                        <p className="text-[18px] font-bold">
                          Phòng: {scheduleItem.roomName}
                        </p>
                        {
                          <Group className="py-3">
                            {scheduleItem.schedules.map((schedule) => {
                              return (
                                <span
                                  key={schedule.id}
                                  className="bg-slate-200 px-4 py-2 cursor-pointer hover:opacity-70"
                                  onClick={() =>
                                    handleClickSchedule(schedule.id)
                                  }
                                >
                                  {schedule.time}
                                </span>
                              );
                            })}
                          </Group>
                        }
                      </Tabs.Panel>

                      <Divider />
                    </div>
                  ))}
            </Tabs>
          )}
        </Modal>
      )}
    </>
  );
};

export default MovieCard;
