import client from "lib/api/client";

// Delete
export const memosDelete = (params: { listId: string }[]) => {
  console.log("memosDeleteが走っています。");
  return client.post("okaimono/memo/delete", { memos: params });
};

export const memoDeleteOpenTrue = (params: { userId:string, listId: string }[]) => {
  console.log("memoDeleteOpenTrueが走っています。");
  return client.post("okaimono/memo/delete_open_memo", { memos: params });
};

export const shoppingDataDelete = (shoppingId: string) => {
  console.log("shoppingDataDeleteが走っています。");
  return client.delete(`okaimono/shoppingdatum/destroy/${shoppingId}`);
};

export const shopDelete = (shopId: string) => {
  console.log("shopDeleteが走っています。");
  return client.delete(`okaimono/shops/destroy/${shopId}`);
};
