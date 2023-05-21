import { Error404 } from "components/pages/errors/Error404";
import { OkaimonoIndex } from "components/pages/okaimono/OkaimonoIndex";
import { OkaimonoMemo } from "components/pages/okaimono/OkaimonoMemo";
import { OkaimonoShopShow } from "components/pages/okaimono/OkaimonoShopShow";
import { OkaimonoShow } from "components/pages/okaimono/OkaimonoShow";

export const OkaimonoRoutes = [
  {
    path: "/",
    exact: true,
    children: <OkaimonoIndex />,
  },
  {
    path: "/okaimono_memo",
    exact: false,
    children: <OkaimonoMemo />,
  },
  {
    path: "/okaimono_show/:id",
    exact: false,
    children: <OkaimonoShow />,
  },
  {
    path: "/okaimono_shop_index",
    exact: false,
    children: <OkaimonoShopShow />,
  },
  {
    path: "*",
    exact: false,
    children: <Error404 />,
  },
];
