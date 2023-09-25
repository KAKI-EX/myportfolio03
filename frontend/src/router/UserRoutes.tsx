import { Error404 } from "components/pages/errors/Error404";
import { SignIn } from "components/pages/users/SignIn";
import { SignUp } from "components/pages/users/SignUp";
import { AccountUpdate } from "components/pages/users/AccountUpdate";
import { UserManagement } from "components/pages/users/UserManagement";
import { Private } from "App";
import { TermsOfService } from "components/pages/TermsOfService";

export const UserRoutes = [
  {
    path: "/",
    exact: true,
    children: (
      <Private>
        <UserManagement />
      </Private>
    ),
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
  path: "/term_of_service",
  exact: false,
  children: <TermsOfService />,
},
  {
    path: "/account_update",
    exact: false,
    children: (
      <Private>
        <AccountUpdate />
      </Private>
    ),
  },
  {
    path: "*",
    exact: false,
    children: <Error404 />,
  },
];
