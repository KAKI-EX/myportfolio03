import { ListFormParams, MergeParams } from "interfaces";
import client from "lib/api/client";

// お店情報作成
export const shopCreate = (params: MergeParams) => {
  console.log("shopCreateが走っています。");
  return client.post("okaimono/shops/create", params);
};

// お店情報作成
export const shopCreateOpenTrue = (params: MergeParams) => {
  console.log("shopCreateOpenTrueが走っています。");
  return client.post("okaimono/shops/create_open_memo", params);
};

// お買物情報作成
export const shoppingDatumCreate = (params: MergeParams) => {
  console.log("shoppingSummaryCreateが走っています。");
  console.log("postParams", params);
  return client.post("okaimono/shoppingdatum/create", params);
};

// メモ情報作成
export const memosCreate = (params: ListFormParams[]) => {
  console.log("memosCreateが走っています。");
  console.log("memosParams", params);
  return client.post("okaimono/memo/create", { memos: params });
};

// メモ情報作成
export const memosCreateOpenTrue = (params: ListFormParams[]) => {
  console.log("memosCreateOpenTrueが走っています。");
  console.log("memosCreateOpenTrue", params);
  return client.post("okaimono/memo/create_open_memos", { memos: params });
};
