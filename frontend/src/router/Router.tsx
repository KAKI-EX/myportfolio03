import { Error404 } from "components/pages/errors/Error404";
import { Home } from "components/pages/Home";
import { HeaderLayout } from "components/templates/HeaderLayout";
import { memo, VFC } from "react";
import { Route, Switch } from "react-router-dom";
import { OkaimonoRoutes } from "./OkaimonoRoutes";
import { UserRoutes } from "./UserRoutes";

export const Router: VFC = memo(() => {
  return (
    <Switch>
      <Route exact path="/">
        <HeaderLayout>
          <Home />
        </HeaderLayout>
      </Route>
      <Route
        path="/user"
        render={({ match: { url } }) => (
          <Switch>
            {UserRoutes.map((route) => (
              <Route key={route.path} exact={route.exact} path={`${url}${route.path}`}>
                <HeaderLayout>{route.children}</HeaderLayout>
              </Route>
            ))}
          </Switch>
        )}
      />
      <Route
        path="/okaimono"
        render={({ match: { url } }) => (
          <Switch>
            {OkaimonoRoutes.map((route) => (
              <Route key={route.path} exact={route.exact} path={`${url}${route.path}`}>
                <HeaderLayout>{route.children}</HeaderLayout>
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
