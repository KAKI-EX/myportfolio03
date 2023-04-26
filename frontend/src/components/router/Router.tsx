import { Error404 } from "components/pages/errors/Error404";
import { Home } from "components/pages/Home";
import { memo, VFC } from "react";
import { Route, Switch } from "react-router-dom";
import { UserRoutes } from "./UserRoutes";

export const Router: VFC = memo(() => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route
        path="/user"
        render={({ match: { url } }) => (
          <Switch>
            {UserRoutes.map((route) => (
              <Route
                key={route.path}
                exact={route.exact}
                path={`${url}${route.path}`}
              >
                {route.children}
              </Route>
            ))}
          </Switch>
        )}
      />
      <Route path="*">
        <Error404 />
      </Route>
    </Switch>
  );
});
