import { ListFormParams, MergeParams, OkaimonoShopModifingData } from "interfaces";
import client from "lib/api/client";

// お買物情報更新
export const shoppingDatumUpdate = (params: MergeParams) => {
  console.log("shoppingDetailUpdateが走っています。");
  console.log("shoppingDatumUpdateParams", params);
  return client.post("okaimono/shoppingdatum/update", params);
};

// お買物情報更新
export const shoppingDatumUpdateOpenTrue = (params: MergeParams) => {
  console.log("shoppingDatumUpdateOpenTrueが走っています。");
  console.log("shoppingDatumUpdateOpenTrue", params);
  return client.post("okaimono/shoppingdatum/update_open_memo", { shoppingDatum: params });
};

// メモ情報更新
export const memosUpdate = (params: ListFormParams[]) => {
  console.log("memosUpdateが走っています。");
  console.log("memosUpdateParams", params);
  return client.post("okaimono/memo/update", { memos: params });
};

export const memosUpdateOpenTrue = (params: ListFormParams[]) => {
  console.log("memosUpdateOpenTrueが走っています。");
  console.log("memosUpdateOpenTrue", params);
  return client.post("okaimono/memo/update_open_memos", { memos: params });
};

export const alertListDelete = (params: { listId: string }[]) => {
  console.log("alertListDeleteが走っています。");
  console.log("alertListDeleteParams", params);
  return client.post("okaimono/memo/update_is_display", { memos: params });
};

// メモ情報更新
export const memoUpdateOpenTrue = (params: MergeParams) => {
  console.log("memosUpdateOpenTrueが走っています。");
  console.log("memosUpdateOpenTrue", params);
  return client.post("okaimono/memo/update_open_memo", { memos: params });
};

// お店情報更新
export const shopUpdate = (params: OkaimonoShopModifingData) => {
  console.log("shopUpdateが走っています。");
  console.log("shopUpdateParams", params);
  return client.post("okaimono/shops/update", { shop: params });
};
