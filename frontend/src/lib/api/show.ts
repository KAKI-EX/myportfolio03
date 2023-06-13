import client from "lib/api/client";

export type shopPropsType = {
  userId?: string;
  shopId: string;
};

export type memoProps = {
  userId?: string;
  shoppingDataId: string;
};

// お店情報確認
export const shopShow = async (props: shopPropsType) => {
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
  console.log("shopShowが走っています。");
  const shopsShowRes = await client.get(`okaimono/shops/index/`);
  return {
    data: shopsShowRes.data,
    status: shopsShowRes.status,
  };
};

// メモ確認
export const memosShow = async (props: memoProps) => {
  const { shoppingDataId } = props;
  console.log("memosShowが走っています。");
  const memosShowRes = await client.get(`okaimono/memo/show?shopping_id=${shoppingDataId}`);
  return {
    data: memosShowRes.data,
    status: memosShowRes.status,
  };
};

// メモ確認
export const memosShowOpenTrue = async (props: memoProps) => {
  const { userId, shoppingDataId } = props;
  console.log("memosShowOpenTrueが走っています。");
  const memosShowOpenTrueRes = await client.get(
    `okaimono/memo/show_open_memo?user_id=${userId}&shopping_id=${shoppingDataId}`
  );
  return {
    data: memosShowOpenTrueRes.data,
    status: memosShowOpenTrueRes.status,
  };
};

// overview部分(お買い物メモ部分)表示
export const shoppingDatumShow = async (props: memoProps) => {
  const { shoppingDataId } = props;
  console.log("shoppingDatumShowが走っています。");
  const shoppingDatumShowRes = await client.get(`okaimono/shoppingdatum/show?shopping_datum_id=${shoppingDataId}`);
  return {
    data: shoppingDatumShowRes.data,
    status: shoppingDatumShowRes.status,
  };
};

// overview部分(お買い物メモ部分)表示
export const shoppingDatumShowOpenTrue = async (props: memoProps) => {
  const { shoppingDataId, userId } = props;
  console.log("shopShowOpenTrueが走っています。");
  const shoppingDatumShowOpenTrueRes = await client.get(
    `okaimono/shoppingdatum/show_open_memo?user_id=${userId}&shopping_datum_id=${shoppingDataId}`
  );
  return {
    data: shoppingDatumShowOpenTrueRes.data,
    status: shoppingDatumShowOpenTrueRes.status,
  };
};
