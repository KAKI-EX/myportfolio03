import Cookies from "js-cookie";
import client from "lib/api/client";

export type shopPropsType = {
  userId?: string;
  shopId?: string;
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
  const shopShowRes = await client.get(`okaimono/shops/show?shop_id=${shopId}`);
  return {
    data: shopShowRes.data,
    status: shopShowRes.status,
  };
};

// お店情報確認
export const shopShowOpenTrue = async (props: shopPropsType) => {
  const { userId, shopId } = props;
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
  const shopsShowRes = await client.get(`okaimono/shops/index/`);
  return {
    data: shopsShowRes.data,
    status: shopsShowRes.status,
  };
};

// お店情報検索
export const shopsSearchSuggestions = async (shopName: string) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const shopsSearchRes = await client.get(`okaimono/shops/suggestion?shop_name=${shopName}`);
  return {
    data: shopsSearchRes.data,
    status: shopsSearchRes.status,
  };
};

// メモ確認（複数メモ読み込み）
export const memosShow = async (props: memoProps) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const { shoppingDatumId } = props;
  const memosShowRes = await client.get(`okaimono/memo/show?shopping_id=${shoppingDatumId}`);
  return {
    data: memosShowRes.data,
    status: memosShowRes.status,
  };
};

// メモ確認（複数メモ読み込み）
export const memosAlertShow = async () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const memosShowRes = await client.get(`okaimono/memo/alert_show`);
  return {
    data: memosShowRes.data,
    status: memosShowRes.status,
  };
};

// メモ確認(公開用ページの複数メモ読み込み)
export const memosShowOpenTrue = async (props: memoProps) => {
  const { userId, shoppingDatumId } = props;
  const memosShowOpenTrueRes = await client.get(
    `okaimono/memo/show_open_memos?user_id=${userId}&shopping_id=${shoppingDatumId}`
  );
  return {
    data: memosShowOpenTrueRes.data,
    status: memosShowOpenTrueRes.status,
  };
};

// メモ確認(単一のメモ読み込み)
export const memoShow = async (listId: string | undefined) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const memoshow = await client.get(`okaimono/memo/show_memo?list_id=${listId}`);
  return {
    data: memoshow.data,
    status: memoshow.status,
  };
};

// メモ確認(公開用ページの単一のメモ読み込み)
export const memoShowOpenTrue = async (props: memoOpenProps) => {
  const { userId, listId } = props;
  const memohow = await client.get(`okaimono/memo/show_open_memo?user_id=${userId}&list_id=${listId}`);
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
  const shoppingDatumShowRes = await client.get(`okaimono/shoppingdatum/show?shopping_datum_id=${shoppingDatumId}`);
  return {
    data: shoppingDatumShowRes.data,
    status: shoppingDatumShowRes.status,
  };
};

// List部分の商品名suggest表示
export const purchaseNameSearchSuggestions = async (purchaseName: string) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  const purchaseSearchRes = await client.get(`okaimono/memo/suggestion?purchase_name=${purchaseName}`);
  return {
    data: purchaseSearchRes.data,
    status: purchaseSearchRes.status,
  };
};
// overview部分(お買い物メモ部分)表示
export const shoppingDatumShowOpenTrue = async (props: memoProps) => {
  const { shoppingDatumId, userId } = props;
  const shoppingDatumShowOpenTrueRes = await client.get(
    `okaimono/shoppingdatum/show_open_memo?user_id=${userId}&shopping_datum_id=${shoppingDatumId}`
  );
  return {
    data: shoppingDatumShowOpenTrueRes.data,
    status: shoppingDatumShowOpenTrueRes.status,
  };
};
