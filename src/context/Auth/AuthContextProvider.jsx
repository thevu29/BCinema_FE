import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import {
  saveToken as saveTokenUtil,
  removeToken as removeTokenUtil,
  getAccessToken,
} from "../../utils/tokenUtil";
import { getUserByIdService } from "../../services/userService";
import { jwtDecode } from "jwt-decode";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = getAccessToken();
    return storedToken || null;
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decodedToken = jwtDecode(token);

        const res = await getUserByIdService(decodedToken.id);

        if (res.success) {
          setUser(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (token) fetchUser();
  }, [token]);

  const saveToken = (data) => {
    setToken(data);
    saveTokenUtil(data);
  };

  const removeToken = () => {
    setToken(null);
    removeTokenUtil();
  };

  return (
    <AuthContext.Provider value={{ user, token, saveToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
