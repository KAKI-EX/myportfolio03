import { OkaimonoParams } from "interfaces";
import client from "lib/api/client";

// お店情報作成
export const shopCreate = (params: OkaimonoParams) => {
  console.log("shopCreateが走っています。");
  return client.post("okaimono/shops/create", params);
};

// お買物情報作成
export const shoppingDatumCreate = (params: OkaimonoParams) => {
  console.log("shoppingSummaryCreateが走っています。");
  console.log("postParams", params);
  return client.post("okaimono/shoppingdatum/create", params);
};

// メモ情報作成
export const memosCreate = (params: OkaimonoParams) => {
  console.log("memosCreateが走っています。");
  console.log("memosParams", params);
  return client.post("okaimono/memo/create", params);
};
