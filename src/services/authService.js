import axios from "../utils/axiosCustom";

export const loginService = async (email, password) => {
  return await axios.post("/auth/login", { email, password });
};

export const logoutService = async () => {
  return await axios.post("/auth/logout");
};

export const loginGoogleService = async (idToken) => {
  return await axios.post("/auth/login/oauth2/google", { idToken });
};

export const sendOtpService = async (email) => {
  return await axios.post("/auth/send-otp", { email });
};

export const resendOtpService = async (email) => {
  return await axios.post("/auth/resend-otp", { email });
};

export const verifyOtpService = async (code) => {
  return await axios.post("/auth/verify-otp", { code });
};

export const registerService = async (formData) => {
  return await axios.post("/auth/register", formData);
};

export const forgotPasswordService = async (email, code, password) => {
  return await axios.post("/auth/forgot-password", { email, code, password });
};

export const refreshTokenService = async () => {
  return await axios.post("/auth/refresh-token");
};
