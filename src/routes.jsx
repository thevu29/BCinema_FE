import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorPage from "./error-page.jsx";
import Home from "./components/User/Home/Home.jsx";
import Dashboard from "./components/Admin/Dashboard/Dashboard.jsx";
import Admin from "./components/Admin/Admin.jsx";
import User from "./components/Admin/User/User.jsx";
import CreateUserForm from "./components/Admin/User/Create/CreateUserForm.jsx";
import UpdateUserForm from "./components/Admin/User/Update/UpdateUserForm.jsx";
import Room from "./components/Admin/Room/Room.jsx";
import CreateRoomForm from "./components/Admin/Room/Create/CreateRoomForm.jsx";
import UpdateRoomForm from "./components/Admin/Room/Update/UpdateRoomForm.jsx";
import Schedule from "./components/Admin/Schedule/Schedule.jsx";
import CreateScheduleForm from "./components/Admin/Schedule/Create/CreateScheduleForm.JSX";
import UpdateScheduleForm from "./components/Admin/Schedule/Update/UpdateScheduleForm.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "admin",
        element: <Admin />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "users", element: <User /> },
          { path: "users/create", element: <CreateUserForm /> },
          { path: "users/:id/update", element: <UpdateUserForm /> },
          { path: "rooms", element: <Room /> },
          { path: "rooms/create", element: <CreateRoomForm /> },
          { path: "rooms/:id/update", element: <UpdateRoomForm /> },
          { path: "schedules", element: <Schedule /> },
          { path: "schedules/create", element: <CreateScheduleForm /> },
          { path: "schedules/:id/update", element: <UpdateScheduleForm /> },
        ],
      },
    ],
  },
]);
