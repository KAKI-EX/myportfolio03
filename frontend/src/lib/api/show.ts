import client from "lib/api/client";

export type shopPropsType = {
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
  console.log("shopShowが走っています。");
  const memosShowRes = await client.get(`okaimono/memo/show?shopping_id=${shoppingDataId}`);
  return {
    data: memosShowRes.data,
    status: memosShowRes.status,
  };
};

export const shoppingDatumShow = async (props: memoProps) => {
  const { shoppingDataId } = props;
  console.log("shopShowが走っています。");
  const shoppingDatumShowRes = await client.get(`okaimono/shoppingdatum/show?shopping_datum_id=${shoppingDataId}`);
  return {
    data: shoppingDatumShowRes.data,
    status: shoppingDatumShowRes.status,
  };
};

export const shoppingDatumShowOpenTrue = async (props: memoProps) => {
  const { shoppingDataId, userId } = props;
  console.log("shopShowOpenTrueが走っています。");
  const shoppingDatumShowRes = await client.get(`okaimono/shoppingdatum/show_open_memo?user_id=${userId}&shopping_datum_id=${shoppingDataId}`);
  return {
    data: shoppingDatumShowRes.data,
    status: shoppingDatumShowRes.status,
  };
};
