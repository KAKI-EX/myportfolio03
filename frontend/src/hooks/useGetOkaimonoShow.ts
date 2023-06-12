import { useCookie } from "hooks/useCookie";
import Cookies from "js-cookie";
import client from "../lib/api/client";

export const useGetOkaimonoShow = (params: string | undefined) => {
  const { separateCookies } = useCookie();
  const id = params;

  const getOkaimonoShow = async () => {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
      return undefined;
    }
    const res = await client.get(`/okaimono/shoppingdatum/show?shopping_datum_id=${id}`);
    return {
      data: res.data,
      status: res.status
    };
  };

  return getOkaimonoShow;
};
