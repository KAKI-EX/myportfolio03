import Cookies from "js-cookie";
import client from "lib/api/client";

export type byShopProps = {
  searchSelect: string;
  searchWord: string;
  startDate: Date;
  endDate: Date;
  searchCurrentPage: number;
};

export const shoppingDataIndexRecord = async (page: number) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const shoppingRecordRes = await client.get(`okaimono/shopping_data/record_index?page=${page}`);
  return {
    data: shoppingRecordRes.data,
    status: shoppingRecordRes.status,
  };
};

export const shoppingDataIndexRecordByShop = async (formData: byShopProps) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const { searchSelect, searchWord, startDate, endDate, searchCurrentPage } = formData;
  const shoppingRecordRes = await client.get(
    `okaimono/shopping_data/search_by_shop?page=${searchCurrentPage}&select=${searchSelect}&word=${searchWord}&start=${startDate}&end=${endDate}`
  );
  return {
    data: shoppingRecordRes.data,
    status: shoppingRecordRes.status,
  };
};
