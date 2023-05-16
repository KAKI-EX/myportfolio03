import client from "lib/api/client";

type shopProps = {
  userId: string;
  shopId: string;
};

type memoProps = {
  userId: string;
  shoppingDataId: string;
};

// お店情報確認
export const shopShow = (props: shopProps) => {
  const { userId, shopId } = props;
  console.log("shopShowが走っています。");
  return client.get(`okaimono/shops/show?user_id=${userId}&shop_id=${shopId}`);
};

// メモ確認
export const memosShow = (props: memoProps) => {
  const { userId, shoppingDataId } = props;
  console.log("shopShowが走っています。");
  return client.get(`okaimono/memo/show?user_id=${userId}&shopping_id=${shoppingDataId}`);
};
