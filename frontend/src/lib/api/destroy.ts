import client from "lib/api/client";

// Delete
export const memosDelete = (params: { listId: string }[]) => {
  return client.post("okaimono/memo/delete", { memos: params });
};

export const memoDeleteOpenTrue = (params: { userId:string, listId: string }[]) => {
  return client.post("okaimono/memo/delete_open_memo", { memos: params });
};

export const shoppingDataDelete = (shoppingId: string) => {
  return client.delete(`okaimono/shoppingdatum/destroy?shopping_datum_id=${shoppingId}`);
};

export const shopDelete = (shopId: string) => {
  return client.delete(`okaimono/shops/destroy/${shopId}`);
};
