import { Error404 } from "components/pages/errors/Error404";
import { SignIn } from "components/pages/users/SignIn";
import { SignUp } from "components/pages/users/SignUp";
import { UserManagement } from "components/pages/users/UserManagement";

export const UserRoutes = [
  {
    path: "/",
    exact: true,
    children: <UserManagement />,
  },
  {
    path: "/sign_in",
    exact: false,
    children: <SignIn />,
  },
  {
    path: "/sign_up",
    exact: false,
    children: <SignUp />,
  },
  {
    path: "*",
    exact: false,
    children: <Error404 />,
  }
];
