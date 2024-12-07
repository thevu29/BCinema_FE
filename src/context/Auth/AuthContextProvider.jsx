import { useState } from "react";
import { AuthContext } from "./authContext";
import { saveToken as saveTokenUtil, removeToken as removeTokenUtil, getAccessToken } from "../../utils/tokenUtil";


const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = getAccessToken();
    return storedToken || null;
  });

  const saveToken = (data) => {
    setToken(data);
    saveTokenUtil(data);
  };

  const removeToken = () => {
    setToken(null);
    removeTokenUtil();
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
