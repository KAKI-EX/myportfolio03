import { ListFormParams, MergeParams } from "interfaces";
import client from "lib/api/client";

// お買物情報作成
export const shoppingDatumUpdate = (params: MergeParams) => {
  console.log("shoppingDetailUpdateが走っています。");
  console.log("shoppingDatumUpdateParams", params);
  return client.post("okaimono/shoppingdatum/update", params);
};

// メモ情報作成
export const memosUpdate = (params: ListFormParams[]) => {
  console.log("memosUpdateが走っています。");
  console.log("memosUpdateParams", params);
  return client.post("okaimono/memo/update", { memos: params });
};
