import { Outlet } from "react-router-dom";
import AuthProvider from "./context/Auth/AuthContextProvider";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Outlet />
    </AuthProvider>
  );
};

export default App;
