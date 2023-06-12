import Cookies from "js-cookie";
import client from "../lib/api/client";

export const useGetOkaimonoIndex = () => {
  const getOkaimonoIndex = async () => {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
      return undefined;
    }
    const res = await client.get(`okaimono/shoppingdatum/index`);
    return {
      data: res.data,
      status: res.status,
    };
  };

  return getOkaimonoIndex;
};
