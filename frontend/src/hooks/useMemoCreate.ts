import { ListFormParams, MergeParams } from "interfaces";
import { memosCreate, shopCreate, shoppingDatumCreate } from "lib/api/post";
import React from "react";
import { useHistory } from "react-router-dom";
import { useCookie } from "./useCookie";
import { useMessage } from "./useToast";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  totalBudget: number;
};

export const useMemoCreate = (props: Props) => {
  console.log("カスタムフックuseMemoCreateが走っています");

  const { separateCookies } = useCookie();
  const history = useHistory();
  const { showMessage } = useMessage();

  const { setLoading, totalBudget } = props;

  const sendDataToAPI = async (formData: MergeParams) => {
    console.log("カスタムフックsendDataToAPIが走っています");

    const userId = separateCookies("_user_id");
    const { shopName, shoppingDate, shoppingMemo, estimatedBudget, isFinish } = formData;
    const shopParams: MergeParams = { userId, shopName: shopName || "お店名称未設定でのお買い物" };

    try {
      setLoading(true);
      const shopCreateRes = await shopCreate(shopParams);
      if (shopCreateRes.status === 200) {
        const shopId = shopCreateRes.data.id;
        const shoppingDataParams: MergeParams = {
          userId,
          shopId,
          shoppingDate,
          shoppingMemo,
          estimatedBudget,
          totalBudget,
          isFinish,
        };
        console.log("koreeee", shoppingDataParams);
        const shoppingDatumCreateRes = await shoppingDatumCreate(shoppingDataParams);
        if (shoppingDatumCreateRes.status === 200) {
          const shoppingDatumId = shoppingDatumCreateRes.data.id;
          const memosParams = {
            memos: (formData.listForm || []).map((data: ListFormParams) => {
              return {
                userId,
                shopId,
                shoppingDatumId,
                purchaseName: data.purchaseName,
                price: data.price,
                shoppingDetailMemo: data.shoppingDetailMemo,
                amount: data.amount,
                shoppingDate,
                expiryDateStart: data.expiryDateStart,
                expiryDateEnd: data.expiryDateEnd,
              };
            }),
          };
          const memosCreateRes = await memosCreate(memosParams.memos);
          history.push("/okaimono");
          if (formData.listForm) {
            showMessage({ title: `${memosCreateRes.data.length}件のメモを登録しました`, status: "success" });
          }
        }
      }
    } catch (err: any) {
      showMessage({ title: err.response.data.errors, status: "error" });
      console.error(err.response);
      console.log(err.response.data.error);
    }
    setLoading(false);
  };
  return sendDataToAPI;
};
