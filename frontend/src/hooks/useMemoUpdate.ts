import { ListFormParams, MergeParams } from "interfaces";
import { memosDelete } from "lib/api/destroy";
import { memosCreate, shopCreate } from "lib/api/post";
import { memosUpdate, shoppingDatumUpdate } from "lib/api/update";
import React from "react";
import { useHistory } from "react-router-dom";
import { useCookie } from "./useCookie";
import { useMessage } from "./useToast";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  totalBudget: number;
};

export const useMemoUpdate = (props: Props) => {
  console.log("カスタムフックuseMemoUpdateが走っています");
  const { separateCookies } = useCookie();
  const history = useHistory();
  const { showMessage } = useMessage();

  const { setLoading, totalBudget } = props;

  const sendUpdateToAPI = async (
    formData: MergeParams,
    deleteIds: string[],
    setDleteIds: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    console.log("カスタムフックsendDataToAPIが走っています");
    const userId = separateCookies("_user_id");
    const { shopName, shoppingDate, shoppingMemo, estimatedBudget, shoppingDatumId, isFinish } = formData;
    const shopParams: MergeParams = { userId, shopName: shopName || "お店名称未設定でのお買い物" };

    try {
      setLoading(true);
      const shopUpdateRes = await shopCreate(shopParams); // updateアクションだがcreateで問題なし。変数名だけupdateに変更。
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
        };
        const shoppingDatumUpdateRes = await shoppingDatumUpdate(shoppingDataParams);
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
                memoId: data.id,
                asc: data.asc,
                expiryDateStart: data.expiryDateStart,
                expiryDateEnd: data.expiryDateEnd,
                isBought: data.isBought,
              };
            }),
          };
          // ---------------------------------------------------------------
          // show画面でフォームを追加した場合を検知して新規で登録する。(updateアクションで対応できないため)

          if (memosParams.memos.some((memo) => memo.memoId === "")) {
            const catchNewMemo = memosParams.memos
              .filter((newMemo) => !newMemo.memoId)
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
            await memosCreate(catchNewMemo);
          }
          // ---------------------------------------------------------------
          // 上記で登録したidが空文字の配列を削除。(既存メモのupdateではないのでエラーが発生するため)
          const existingMemos = memosParams.memos.filter((newMemo) => newMemo.memoId);
          // ---------------------------------------------------------------
          // 特定メモの削除。show画面で赤✗ボタンを押した際にdeleteIdsにはidが入り、保存ボタン押下で一括削除。
          if (deleteIds.length > 0) {
            const deleteArrays = deleteIds.map((t) => {
              const deleteArray = {
                userId,
                memoId: t,
              };
              return deleteArray;
            });
            await memosDelete(deleteArrays);
            setDleteIds([]);
          }
          // ---------------------------------------------------------------
          const memosUpdateRes = await memosUpdate(existingMemos);
          if (formData.listForm) {
            showMessage({ title: `お買い物メモの処理が完了しました。`, status: "success" });
          }
          setLoading(false);
          return memosUpdateRes;
        }
      }
    } catch (err: any) {
      showMessage({ title: err.response.data.error, status: "error" });
      console.error(err.response);
      console.log(err.response.data.error);
      setLoading(false);
    }
  };
  return sendUpdateToAPI;
};
