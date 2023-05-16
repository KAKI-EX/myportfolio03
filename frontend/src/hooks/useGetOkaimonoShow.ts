import { useCookie } from "hooks/useCookie";
import Cookies from "js-cookie";
import client from "../lib/api/client";

export const useGetOkaimonoShow = (params: string | undefined) => {
  const { separateCookies } = useCookie();
  const id = params;
  console.log("useGetOkaimonoShow", id);

  const getOkaimonoShow = async () => {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
      return undefined;
    }
    const userId = separateCookies("_user_id");
    const res = await client.get(`/okaimono/shoppingdatum/show?user_id=${userId}&shopping_data=${id}`);
    return {
      data: res.data,
      status: res.status
    };
  };

  return getOkaimonoShow;
};
