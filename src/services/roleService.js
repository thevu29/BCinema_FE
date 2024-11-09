import axios from "../utils/axiosCustom";

export const getRolesService = async () => {
  const res = await axios.get("/roles");
  return res;
};
