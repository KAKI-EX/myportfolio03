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
  const shoppingRecordRes = await client.get(`okaimono/shoppingdatum/record_index?page=${page}`);
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
    `okaimono/shoppingdatum/search_by_shop?page=${searchCurrentPage}&select=${searchSelect}&word=${searchWord}&start=${startDate}&end=${endDate}`
  );
  return {
    data: shoppingRecordRes.data,
    status: shoppingRecordRes.status,
  };
};

export const shoppingDataIndexRecordByPurchase = async (formData: byShopProps) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const { searchWord, startDate, endDate, searchCurrentPage } = formData;
  const shoppingRecordRes = await client.get(
    `okaimono/shoppingdatum/search_by_purchase?page=${searchCurrentPage}&word=${searchWord}&start_date=${startDate}&end_date=${endDate}`
  );
  return {
    data: shoppingRecordRes.data,
    status: shoppingRecordRes.status,
  };
};
