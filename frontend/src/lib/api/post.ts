import { ListFormParams, MergeParams } from "interfaces";
import client from "lib/api/client";

// お店情報作成
export const shopCreate = (params: MergeParams) => {
  return client.post("okaimono/shops/create", params);
};

// お店情報作成
export const shopCreateOpenTrue = (params: MergeParams) => {
  return client.post("okaimono/shops/create_open_memo", params);
};

// お買物情報作成
export const shoppingDatumCreate = (params: MergeParams) => {
  return client.post("okaimono/shoppingdatum/create", params);
};

// メモ情報作成
export const memosCreate = (params: ListFormParams[]) => {
  return client.post("okaimono/memo/create", { memos: params });
};

// メモ情報作成
export const memosCreateOpenTrue = (params: ListFormParams[]) => {
  return client.post("okaimono/memo/create_open_memos", { memos: params });
};
