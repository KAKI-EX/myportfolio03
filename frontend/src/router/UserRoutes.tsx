import { Error404 } from "components/pages/errors/Error404";
import { SignIn } from "components/pages/users/SignIn";
import { SignUp } from "components/pages/users/SignUp";
import { AccountUpdate } from "components/pages/users/AccountUpdate";
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
    path: "/account_update",
    exact: false,
    children: <AccountUpdate />,
  },
  {
    path: "*",
    exact: false,
    children: <Error404 />,
  },
];
