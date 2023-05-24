import client from "lib/api/client";

export type shopPropsType = {
  userId: number;
  shopId: number;
};

export type memoProps = {
  userId: number;
  shoppingDataId: string;
};

// お店情報確認
export const shopShow = async (props: shopPropsType) => {
  const { userId, shopId } = props;
  console.log("shopShowが走っています。");
  const shopShowRes = await client.get(`okaimono/shops/show?user_id=${userId}&shop_id=${shopId}`);
  return {
    data: shopShowRes.data,
    status: shopShowRes.status,
  };
};

// お店一覧表示
export const shopsShow = async (userId: string) => {
  console.log("shopShowが走っています。");
  const shopsShowRes = await client.get(`okaimono/shops/index/${userId}`);
  return {
    data: shopsShowRes.data,
    status: shopsShowRes.status,
  };
};

// メモ確認
export const memosShow = async (props: memoProps) => {
  const { userId, shoppingDataId } = props;
  console.log("shopShowが走っています。");
  const memosShowRes = await client.get(`okaimono/memo/show?user_id=${userId}&shopping_id=${shoppingDataId}`);
  return {
    data: memosShowRes.data,
    status: memosShowRes.status,
  };
};
