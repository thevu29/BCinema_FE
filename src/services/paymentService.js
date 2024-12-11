import axios from "../utils/axiosCustom";

export const addPaymentService = async (data) => {
  return axios.post("/payments", data);
};

export const momoBankingUrlService = async (paymentId) => {
  return axios.post("/payments/momo", { paymentId });
};
