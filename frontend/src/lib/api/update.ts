import { ListFormParams, MergeParams, OkaimonoShopModifingData } from "interfaces";
import client from "lib/api/client";

// お買物情報更新
export const shoppingDatumUpdate = (params: MergeParams) => {
  return client.post("okaimono/shoppingdatum/update", { shoppingDatum: params });
};

// お買物情報更新
export const shoppingDatumUpdateOpenTrue = (params: MergeParams) => {
  return client.post("okaimono/shoppingdatum/update_open_memo", { shoppingDatum: params });
};

// メモ情報更新
export const memosUpdate = (params: ListFormParams[]) => {
  return client.post("okaimono/memo/update", { memos: params });
};

export const memosUpdateOpenTrue = (params: ListFormParams[]) => {
  return client.post("okaimono/memo/update_open_memos", { memos: params });
};

export const alertListDelete = (params: { listId: string }[]) => {
  return client.post("okaimono/memo/update_is_display", { memos: params });
};

// メモ情報更新
export const memoUpdateOpenTrue = (params: MergeParams) => {
  return client.post("okaimono/memo/update_open_memo", { memos: params });
};

// お店情報更新
export const shopUpdate = (params: OkaimonoShopModifingData) => {
  return client.post("okaimono/shops/update", { shop: params });
};
