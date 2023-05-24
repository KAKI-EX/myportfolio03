import { ListFormParams, MergeParams, OkaimonoShopModifingData } from "interfaces";
import client from "lib/api/client";

// お買物情報更新
export const shoppingDatumUpdate = (params: MergeParams) => {
  console.log("shoppingDetailUpdateが走っています。");
  console.log("shoppingDatumUpdateParams", params);
  return client.post("okaimono/shoppingdatum/update", params);
};

// メモ情報更新
export const memosUpdate = (params: ListFormParams[]) => {
  console.log("memosUpdateが走っています。");
  console.log("memosUpdateParams", params);
  return client.post("okaimono/memo/update", { memos: params });
};

// お店情報更新
export const shopUpdate = (params: OkaimonoShopModifingData) => {
  console.log("shopUpdateが走っています。");
  console.log("shopUpdateParams", params);
  return client.post("okaimono/shops/update", { shop: params });
};
