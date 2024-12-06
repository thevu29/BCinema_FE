import axios from "../utils/axiosCustom";

export const getSeatsInRoomService = async (roomId) => {
  return await axios.get(`/seats/room/${roomId}`);
};

export const addSeatService = async (data) => {
  return await axios.post("/seats", data);
};

export const updateSeatService = async (id, data) => {
  return await axios.put(`/seats/${id}`, data);
};

export const getSeatByIdService = async (id) => {
  return await axios.get(`/seats/${id}`);
}

