import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorPage from "./error-page.jsx";
import Home from "./components/User/Home/Home.jsx";
import Dashboard from "./components/Admin/Dashboard/Dashboard.jsx";
import Admin from "./components/Admin/Admin.jsx";
import User from "./components/Admin/User/User.jsx";
import CreateUserForm from "./components/Admin/User/Create/CreateUserForm.jsx";
import UpdateUserForm from "./components/Admin/User/Update/UpdateUserForm.jsx";

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
        ],
      },
    ],
  },
]);
