import { AuthContext, Private } from "App";
import { Error404 } from "components/pages/errors/Error404";
import { Home } from "components/pages/Home";
import { OkaimonoOpenTrue } from "components/pages/okaimono/OkaimonoOpenTrue";
import { HeaderLayout } from "components/templates/HeaderLayout";
import { memo, useContext, VFC } from "react";
import { Route, Switch } from "react-router-dom";
import { OkaimonoRoutes } from "./OkaimonoRoutes";
import { UserRoutes } from "./UserRoutes";

export const Router: VFC = memo(() => {
  const { loading, isSignedIn } = useContext(AuthContext);
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
                <HeaderLayout>
                  <Private loading={loading} isSignedIn={isSignedIn}>
                    {route.children}
                  </Private>
                </HeaderLayout>
              </Route>
            ))}
          </Switch>
        )}
      />
      <Route path="/okaimono_memo_use_open/:userId/:shoppingDatumId">
        <HeaderLayout>
          <OkaimonoOpenTrue />
        </HeaderLayout>
      </Route>
      <Route>
        <Error404 />
      </Route>
    </Switch>
  );
});
