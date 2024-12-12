import axios from "../utils/axiosCustom";

export const getSeatSchedulesByScheduleId = async (scheduleId) => {
  return axios.get(`/seat-schedules/schedule/${scheduleId}`);
};

export const getSeatSchedulesByScheduleIdAndSeatId = async (
  scheduleId,
  seatId
) => {
  return axios.get(`/seat-schedules/schedule/${scheduleId}/seat/${seatId}`);
};

export const getSeatScheduleById = async (id) => {
  return axios.get(`/seat-schedules/${id}`);
};
