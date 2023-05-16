import { useCookie } from "hooks/useCookie";
import Cookies from "js-cookie";
import client from "../lib/api/client";

// 関数

export const useGetOkaimonoIndex = () => {
  const { separateCookies } = useCookie();

  const getOkaimonoIndex = async () => {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
      return undefined;
    }
    const userId = separateCookies("_user_id");
    const res = await client.get(`okaimono/shoppingdatum/index/${userId}`);
    return {
      data: res.data,
      status: res.status,
    };
  };

  return getOkaimonoIndex;
};
