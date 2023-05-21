import client from "lib/api/client";

// Delete
// eslint-disable-next-line
export const memosDelete = (params: { memo_id: string }[]) => {
  console.log("memosDeleteが走っています。");
  return client.post("okaimono/memo/delete", { memos: params });
};

export const shoppingDataDelete = (userId: number, shoppingId: string) => {
  console.log("kokoyaa", userId, shoppingId);
  console.log("shoppingDataDeleteが走っています。");
  return client.delete(`okaimono/shoppingdatum/destroy/${userId}/${shoppingId}`);
};
