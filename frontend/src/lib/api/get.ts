import { useCookie } from "hooks/useCookie";
import Cookies from "js-cookie";
import client from "./client";

// 関数

export const useGetOkaimonoIndex = () => {
  const { separateCookies } = useCookie();

  const getOkaimonoIndex = async () => {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
      return console.log("ここに来てる");
    }
    const userId = separateCookies("_user_id");
    const res = await client.get(`okaimono/shoppingdatum/index/${userId}`);
    return res;
  };

  return getOkaimonoIndex;
};
