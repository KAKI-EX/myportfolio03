import { ListFormParams, MergeParams } from "interfaces";
import { memoDeleteOpenTrue } from "lib/api/destroy";
import { memosCreateOpenTrue, shopCreateOpenTrue } from "lib/api/post";
import { memosUpdateOpenTrue, shoppingDatumUpdateOpenTrue } from "lib/api/update";
import React from "react";
import { useMessage } from "./useToast";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useOpenMemoUpdate = (props: Props) => {
  const { showMessage } = useMessage();

  const { setLoading } = props;

  const sendOpenDataToAPI = async (
    formData: MergeParams,
    deleteIds: string[],
    setDleteIds: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const { shopName, shoppingDate, shoppingMemo, estimatedBudget, shoppingDatumId, isFinish, userId, totalBudget } =
      formData;
    const shopParams: MergeParams = { shopName: shopName || "お店名称未設定でのお買い物", userId };

    try {
      setLoading(true);
      const shopUpdateRes = await shopCreateOpenTrue(shopParams); // updateアクションだがcreateで問題なし。変数名だけupdateに変更。
      if (shopUpdateRes.status === 200) {
        const shopId = shopUpdateRes.data.id;
        const shoppingDataParams: MergeParams = {
          userId,
          shopId,
          shoppingDate,
          shoppingMemo,
          estimatedBudget,
          totalBudget,
          shoppingDatumId,
          isFinish,
          isOpen: false,
        };
        const shoppingDatumUpdateRes = await shoppingDatumUpdateOpenTrue(shoppingDataParams);
        if (shoppingDatumUpdateRes.status === 200) {
          const resShoppingDatumId = shoppingDatumUpdateRes.data.id;
          const memosParams = {
            memos: (formData.listForm || []).map((data: ListFormParams) => {
              return {
                userId,
                shopId,
                shoppingDatumId: resShoppingDatumId,
                purchaseName: data.purchaseName,
                price: data.price,
                shoppingDetailMemo: data.shoppingDetailMemo,
                amount: data.amount,
                shoppingDate,
                listId: data.id,
                asc: data.asc,
                expiryDateStart: data.expiryDateStart,
                expiryDateEnd: data.expiryDateEnd,
                isBought: data.isBought,
              };
            }),
          };
          // ---------------------------------------------------------------
          // show画面でフォームを追加した場合を検知して新規で登録する。(updateアクションで対応できないため)

          if (memosParams.memos.some((memo) => memo.listId === "")) {
            const catchNewMemo = memosParams.memos
              .filter((newMemo) => !newMemo.listId)
              .map((newMemo) => {
                const updateCreate: ListFormParams = {
                  userId,
                  shopId,
                  shoppingDatumId: resShoppingDatumId,
                  purchaseName: newMemo.purchaseName,
                  price: newMemo.price,
                  shoppingDetailMemo: newMemo.shoppingDetailMemo,
                  amount: newMemo.amount,
                  shoppingDate,
                  asc: newMemo.asc,
                  expiryDateStart: newMemo.expiryDateStart,
                  expiryDateEnd: newMemo.expiryDateEnd,
                };
                return updateCreate;
              });
            await memosCreateOpenTrue(catchNewMemo);
          }
          // ---------------------------------------------------------------
          // 上記で登録したidが空文字の配列を削除。(既存メモのupdateではないのでエラーが発生するため)
          const existingMemos = memosParams.memos.filter((newMemo) => newMemo.listId);
          // ---------------------------------------------------------------
          // 特定メモの削除。show画面で赤✗ボタンを押した際にdeleteIdsにはidが入り、保存ボタン押下で一括削除。
          if (deleteIds.length > 0) {
            if (userId) {
              const deleteArrays = deleteIds.map((t) => {
                const deleteArray = {
                  userId,
                  listId: t,
                };
                return deleteArray;
              });
              await memoDeleteOpenTrue(deleteArrays);
              setDleteIds([]);
            }
          }
          // ---------------------------------------------------------------
          const memosUpdateRes = await memosUpdateOpenTrue(existingMemos);
          if (formData.listForm) {
            showMessage({ title: `お買い物メモの処理が完了しました。`, status: "success" });
          }
          setLoading(false);
          return memosUpdateRes;
        }
      }
    } catch (err: any) {
      showMessage({ title: err.response.data.error, status: "error" });
      // eslint-disable-next-line no-console
      console.error(err.response);
      setLoading(false);
    }
  };
  return sendOpenDataToAPI;
};
