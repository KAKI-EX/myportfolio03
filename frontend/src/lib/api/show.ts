import Cookies from "js-cookie";
import client from "lib/api/client";

export type shopPropsType = {
  userId?: string;
  shopId: string;
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

// お店情報確認
export const shopShow = async (props: shopPropsType) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const { shopId } = props;
  console.log("shopShowが走っています。");
  const shopShowRes = await client.get(`okaimono/shops/show?shop_id=${shopId}`);
  return {
    data: shopShowRes.data,
    status: shopShowRes.status,
  };
};

// お店情報確認
export const shopShowOpenTrue = async (props: shopPropsType) => {
  const { userId, shopId } = props;
  console.log("shopShowOpenTrueが走っています。");
  const shopShowOpenTrueRes = await client.get(`okaimono/shops/show_open_memo?user_id=${userId}&shop_id=${shopId}`);
  return {
    data: shopShowOpenTrueRes.data,
    status: shopShowOpenTrueRes.status,
  };
};

// お店一覧表示
export const shopsShow = async () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  console.log("shopShowが走っています。");
  const shopsShowRes = await client.get(`okaimono/shops/index/`);
  return {
    data: shopsShowRes.data,
    status: shopsShowRes.status,
  };
};

// メモ確認（複数メモ読み込み）
export const memosShow = async (props: memoProps) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const { shoppingDatumId } = props;
  console.log("memosShowが走っています。");
  const memosShowRes = await client.get(`okaimono/memo/show?shopping_id=${shoppingDatumId}`);
  return {
    data: memosShowRes.data,
    status: memosShowRes.status,
  };
};

// メモ確認(公開用ページの複数メモ読み込み)
export const memosShowOpenTrue = async (props: memoProps) => {
  const { userId, shoppingDatumId } = props;
  console.log("memosShowOpenTrueが走っています。");
  const memosShowOpenTrueRes = await client.get(
    `okaimono/memo/show_open_memos?user_id=${userId}&shopping_id=${shoppingDatumId}`
  );
  return {
    data: memosShowOpenTrueRes.data,
    status: memosShowOpenTrueRes.status,
  };
};

// メモ確認(単一のメモ読み込み)
export const memoShow = async (listId: string) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  console.log("memosShowOpenTrueが走っています。");
  const memoshow = await client.get(`okaimono/memo/show_memo?memo_id=${listId}`);
  return {
    data: memoshow.data,
    status: memoshow.status,
  };
};

// メモ確認(公開用ページの単一のメモ読み込み)
export const memoShowOpenTrue = async (props: memoOpenProps) => {
  const { userId, listId } = props;
  console.log("memoShowOpenTrueが走っています。");
  const memohow = await client.get(`okaimono/memo/show_open_memo?user_id=${userId}&memo_id=${listId}`);
  return {
    data: memohow.data,
    status: memohow.status,
  };
};

// OkaimonoIndexページの一覧表示
export const shoppingDataIndex = async () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const shoppingDataIndexRes = await client.get(`okaimono/shoppingdatum/index`);
  return {
    data: shoppingDataIndexRes.data,
    status: shoppingDataIndexRes.status,
  };
};

// overview部分(お買い物メモ部分)表示
export const shoppingDatumShow = async (props: memoProps) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const { shoppingDatumId } = props;
  console.log("shoppingDatumShowが走っています。");
  const shoppingDatumShowRes = await client.get(`okaimono/shoppingdatum/show?shopping_datum_id=${shoppingDatumId}`);
  return {
    data: shoppingDatumShowRes.data,
    status: shoppingDatumShowRes.status,
  };
};

// overview部分(お買い物メモ部分)表示
export const shoppingDatumShowOpenTrue = async (props: memoProps) => {
  const { shoppingDatumId, userId } = props;
  console.log("shopShowOpenTrueが走っています。");
  const shoppingDatumShowOpenTrueRes = await client.get(
    `okaimono/shoppingdatum/show_open_memo?user_id=${userId}&shopping_datum_id=${shoppingDatumId}`
  );
  return {
    data: shoppingDatumShowOpenTrueRes.data,
    status: shoppingDatumShowOpenTrueRes.status,
  };
};
