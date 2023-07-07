import Cookies from "js-cookie";
import client from "lib/api/client";

export type shopPropsType = {
  userId?: string;
  shopId?: string;
};

export type memoProps = {
  userId?: string;
  shoppingDataId?: string;
  shoppingDatumId: string;
};

export type memoOpenProps = {
  userId: string;
  listId: string;
};

export const shoppingDataIndexRecord = async (page: number) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  console.log("page", page);
  const shoppingRecordRes = await client.get(`okaimono/shopping_data/record_index?page=${page}`);
  return {
    data: shoppingRecordRes.data,
    status: shoppingRecordRes.status,
  };
};
