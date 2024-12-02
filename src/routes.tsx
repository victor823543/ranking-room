import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthenticatedRoute from "./components/layout/AuthenticatedRoute";
import Account from "./views/Account";
import AddObjects from "./views/AddObjects/AddObjects";
import Create from "./views/Create";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Rank from "./views/Rank/Rank";
import Room from "./views/Room";
import Rooms from "./views/Rooms";
import RoomSettings from "./views/RoomSettings/RoomSettings";
import Settings from "./views/Settings/Settings";
import Signup from "./views/Signup";
import Social from "./views/Social";

const Routes = () => {
  const openRoutes = [
    {
      path: "/",
      element: <Dashboard />,
      errorElement: <NotFound />,
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <NotFound />,
    },
  ];

  const authenticatedRoutes = [
    {
      path: "/",
      element: <AuthenticatedRoute />,
      children: [
        {
          path: "/rooms",
          element: <Rooms />,
        },
        {
          path: "/rooms/:id",
          element: <Room />,
        },
        {
          path: "/rooms/:id/add-objects",
          element: <AddObjects />,
        },
        {
          path: "/rooms/:id/rank",
          element: <Rank />,
        },
        {
          path: "/rooms/:id/settings",
          element: <RoomSettings />,
        },
        {
          path: "/social",
          element: <Social />,
        },
        {
          path: "/create",
          element: <Create />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/account",
          element: <Account />,
        },
      ],
    },
  ];

  const router = createBrowserRouter([...openRoutes, ...authenticatedRoutes]);

  return <RouterProvider router={router} />;
};

export default Routes;
