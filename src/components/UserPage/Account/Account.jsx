import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/Auth/authContext";
import AccountNavbar from "./Navbar/AccountNavbar";

const Account = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto md:p-4 grid grid-cols-1 md:grid-cols-12 md:gap-4 lg:py-10">
        <AccountNavbar />
        <div className="md:col-span-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Account;
