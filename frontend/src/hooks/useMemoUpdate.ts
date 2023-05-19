import { ListFormParams, MergeParams } from "interfaces";
import { memosCreate, shopCreate } from "lib/api/post";
import { memosDelete, memosUpdate, shoppingDatumUpdate } from "lib/api/update";
import React from "react";
import { useHistory } from "react-router-dom";
import { useCookie } from "./useCookie";
import { useMessage } from "./useToast";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  total_budget: number; // eslint-disable-line
};

export const useMemoUpdate = (props: Props) => {
  console.log("カスタムフックuseMemoUpdateが走っています");
  const { separateCookies } = useCookie();
  const history = useHistory();
  const { showMessage } = useMessage();

  const { setLoading, total_budget } = props; // eslint-disable-line

  const sendUpdateToAPI = async (
    formData: MergeParams,
    deleteIds: string[],
    setDleteIds: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    console.log("カスタムフックsendDataToAPIが走っています");
    const user_id = separateCookies("_user_id"); // eslint-disable-line
    const {
      shop_name, // eslint-disable-line
      shopping_date, // eslint-disable-line
      shopping_memo, // eslint-disable-line
      estimated_budget, // eslint-disable-line
      shopping_datum_id, // eslint-disable-line
      asc,
    } = formData; // eslint-disable-line
    const shopParams: MergeParams = { user_id, shop_name: shop_name || "お店名称未設定でのお買い物" }; // eslint-disable-line

    try {
      setLoading(true);
      const shopUpdateRes = await shopCreate(shopParams); // updateアクションだがcreateで問題なし。変数名だけupdateに変更。
      if (shopUpdateRes.status === 200) {
        const shop_id = shopUpdateRes.data.id; // eslint-disable-line
        const shoppingDataParams: MergeParams = {
          user_id,
          shop_id,
          shopping_date,
          shopping_memo,
          estimated_budget,
          total_budget,
          shopping_datum_id,
        };
        const shoppingDatumUpdateRes = await shoppingDatumUpdate(shoppingDataParams);
        if (shoppingDatumUpdateRes.status === 200) {
          const shopping_datum_id = shoppingDatumUpdateRes.data.id; // eslint-disable-line
          const memosParams = {
            memos: (formData.listForm || []).map((data: ListFormParams) => {
              return {
                user_id,
                shop_id,
                shopping_datum_id,
                purchase_name: data.purchase_name,
                price: data.price,
                shopping_detail_memo: data.shopping_detail_memo,
                amount: data.amount,
                shopping_date,
                memo_id: data.id,
                asc: data.asc,
              };
            }),
          };
          // ---------------------------------------------------------------
          // show画面でフォームを追加した場合を検知して新規で登録する。(updateアクションで対応できないため)

          if (memosParams.memos.some((memo) => memo.memo_id === "")) {
            const catchNewMemo = memosParams.memos
              .filter((newMemo) => !newMemo.memo_id)
              .map((newMemo) => {
                const updateCreate: ListFormParams = {
                  user_id,
                  shop_id,
                  shopping_datum_id,
                  purchase_name: newMemo.purchase_name,
                  price: newMemo.price,
                  shopping_detail_memo: newMemo.shopping_detail_memo,
                  amount: newMemo.amount,
                  shopping_date,
                  asc: newMemo.asc,
                };
                return updateCreate;
              });
            await memosCreate(catchNewMemo);
          }
          // ---------------------------------------------------------------
          // 上記で登録したidが空文字の配列を削除。(既存メモのupdateではないのでエラーが発生するため)
          const existingMemos = memosParams.memos.filter((newMemo) => newMemo.memo_id);
          // ---------------------------------------------------------------
          // 特定メモの削除。show画面で赤✗ボタンを押した際にdeleteIdsにはidが入り、保存で一括削除。
          if (deleteIds.length > 0) {
            const deleteArrays = deleteIds.map((t) => {
              const deleteArray = {
                user_id,
                memo_id: t,
              };
              return deleteArray;
            });
            await memosDelete(deleteArrays);
            setDleteIds([]);
          }
          // ---------------------------------------------------------------
          const memosUpdateRes = await memosUpdate(existingMemos);
          if (formData.listForm) {
            showMessage({ title: `お買い物メモの修正が完了しました。`, status: "success" });
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
