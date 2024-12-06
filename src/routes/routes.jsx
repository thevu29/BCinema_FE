import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Dashboard from "../components/Admin/Dashboard/Dashboard.jsx";
import UserPage from "../components/UserPage/UserPage.jsx";
import Admin from "../components/Admin/Admin.jsx";
import User from "../components/Admin/User/User.jsx";
import CreateUserForm from "../components/Admin/User/Create/CreateUserForm.jsx";
import UpdateUserForm from "../components/Admin/User/Update/UpdateUserForm.jsx";
import Room from "../components/Admin/Room/Room.jsx";
import CreateRoomForm from "../components/Admin/Room/Create/CreateRoomForm.jsx";
import UpdateRoomForm from "../components/Admin/Room/Update/UpdateRoomForm.jsx";
import Schedule from "../components/Admin/Schedule/Schedule.jsx";
import CreateScheduleForm from "../components/Admin/Schedule/Create/CreateScheduleForm.jsx";
import AutoCreateScheduleForm from "../components/Admin/Schedule/Create/AutoCreateScheduleForm.jsx";
import UpdateScheduleForm from "../components/Admin/Schedule/Update/UpdateScheduleForm.jsx";
import ScheduleDetail from "../components/Admin/Schedule/Details/ScheduleDetail.jsx";
import SeatSchedule from "../components/Admin/SeatSchedule/SeatSchedule.jsx";
import Voucher from "../components/Admin/Voucher/Voucher.jsx";
import CreateVoucherForm from "../components/Admin/Voucher/Create/CreateVoucherForm.jsx";
import Role from "../components/Admin/Role/Role.jsx";
import CreateRoleForm from "../components/Admin/Role/Create/CreateRoleForm.jsx";
import UpdateRoleForm from "../components/Admin/Role/Update/UpdateRoleForm.jsx";
import Seat from "../components/Admin/Seat/Seat.jsx";
import CreateSeatForm from "../components/Admin/Seat/Create/CreateSeatForm.jsx";
import SeatType from "../components/Admin/SeatType/SeatType.jsx";
import CreateSeatTypeForm from "../components/Admin/SeatType/Create/CreateSeatTypeForm.jsx";
import UpdateSeatTypeForm from "../components/Admin/SeatType/Update/UpdateSeatTypeForm.jsx";
import Home from "../components/UserPage/Home/Home.jsx";
import ScheduleSeat from "../components/UserPage/ScheduleSeat/ScheduleSeat.jsx";
import TicketPrice from "../components/UserPage/TicketPrice/TicketPrice.jsx";
import Food from "../components/Admin/Food/Food.jsx";
import CreateFoodForm from "../components/Admin/Food/Create/CreateFoodForm.jsx";
import UpdateFoodForm from "../components/Admin/Food/Update/UpdateFoodForm.jsx";
import Movie from "../components/Admin/Movie/Movie.jsx";
import MoviesPage from "../components/UserPage/Movie/MoviesPage.jsx";
import ScheduleFood from "../components/UserPage/Food/ScheduleFood.jsx";
import Error from "../components/Error/Error.jsx";
import NotFound from "../components/Error/NotFound.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <UserPage />,
        children: [
          { index: true, element: <Home /> },
          { path: "movies", element: <MoviesPage /> },
          {
            path: "schedules/:scheduleId/seat-schedules",
            element: <ScheduleSeat />,
          },
          {
            path: "schedules/:scheduleId/seat-schedules/food-schedules",
            element: <ScheduleFood />,
          },
          { path: "ticket-price", element: <TicketPrice /> },
        ],
      },
      // { path: "login", element: <Login /> },
      // { path: "register", element: <Register /> },
      {
        path: "admin",
        element: <Admin />,
        children: [
          { index: true, element: <Dashboard /> },

          // Users
          { path: "users", element: <User /> },
          { path: "users/create", element: <CreateUserForm /> },
          { path: "users/:id/update", element: <UpdateUserForm /> },

          // Foods
          { path: "foods", element: <Food /> },
          { path: "foods/create", element: <CreateFoodForm /> },
          { path: "foods/:id/update", element: <UpdateFoodForm /> },

          // Movies
          { path: "movies", element: <Movie /> },

          // Rooms
          { path: "rooms", element: <Room /> },
          { path: "rooms/create", element: <CreateRoomForm /> },
          { path: "rooms/:id/update", element: <UpdateRoomForm /> },

          // Seats
          { path: "seats", element: <Seat /> },
          { path: "seats/create", element: <CreateSeatForm /> },

          // Seat types
          { path: "seat-types", element: <SeatType /> },
          { path: "seat-types/create", element: <CreateSeatTypeForm /> },
          { path: "seat-types/:id/update", element: <UpdateSeatTypeForm /> },

          // Schedules
          { path: "schedules", element: <Schedule /> },
          { path: "schedules/create", element: <CreateScheduleForm /> },
          {
            path: "schedules/auto-create",
            element: <AutoCreateScheduleForm />,
          },
          { path: "schedules/:id/update", element: <UpdateScheduleForm /> },
          { path: "schedules/details", element: <ScheduleDetail /> },

          // Seat Schedules
          {
            path: "schedules/:scheduleId/seat-schedules",
            element: <SeatSchedule />,
          },

          // Vouchers
          { path: "vouchers", element: <Voucher /> },
          { path: "vouchers/create", element: <CreateVoucherForm /> },

          // Roles
          { path: "roles", element: <Role /> },
          { path: "roles/create", element: <CreateRoleForm /> },
          { path: "roles/:id/update", element: <UpdateRoleForm /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);