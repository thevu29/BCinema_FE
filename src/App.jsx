import { Outlet } from "react-router-dom";
import AuthProvider from "./context/Auth/AuthContextProvider";

const App = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default App;
