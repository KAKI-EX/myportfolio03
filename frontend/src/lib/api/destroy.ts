import client from "lib/api/client";

// Delete
export const memosDelete = (params: { memoId: string }[]) => {
  console.log("memosDeleteが走っています。");
  return client.post("okaimono/memo/delete", { memos: params });
};

export const shoppingDataDelete = (userId: string, shoppingId: string) => {
  console.log("shoppingDataDeleteが走っています。");
  return client.delete(`okaimono/shoppingdatum/destroy/${userId}/${shoppingId}`);
};

export const shopDelete = (userId: string, shopId: string) => {
  console.log("shopDeleteが走っています。");
  return client.delete(`okaimono/shops/destroy/${userId}/${shopId}`);
};
