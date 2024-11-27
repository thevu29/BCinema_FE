import axios from "../utils/axiosCustom";

export const getSeatSchedulesByScheduleId = async (scheduleId) => {
    return axios.get(`/seat-schedules/schedule/${scheduleId}`);
}