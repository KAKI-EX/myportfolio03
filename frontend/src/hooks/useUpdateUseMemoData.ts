import React from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { MergeParams } from "interfaces";
import { shopCreate } from "lib/api/post";
import { shoppingDatumUpdate } from "lib/api/update";

type Props = {
  setReadOnly: (value: React.SetStateAction<boolean>) => void;
  readOnly: boolean;
  setLoading: (value: React.SetStateAction<boolean>) => void;
  shoppingDatumFormData: MergeParams;
};

export const useUpdateUseMemoData = () => {
  const { showMessage } = useMessage();

  const updateShoppingData = async (props: Props) => {
    const { setReadOnly, readOnly, setLoading, shoppingDatumFormData } = props;
    setReadOnly(!readOnly);
    if (!readOnly) {
      setLoading(true);
      const { modifyShopName, modifyShoppingDate, modifyShoppingMemo, modifyEstimatedBudget, modyfyShoppingDatumId } =
        shoppingDatumFormData;
      const shopParams: MergeParams = { shopName: modifyShopName || "お店名称未設定でのお買い物" };
      try {
        const shopUpdateRes = await shopCreate(shopParams);
        if (shopUpdateRes.status === 200) {
          const shopId = shopUpdateRes.data.id;
          const shoppingDataParams: MergeParams = {
            shopId,
            shoppingDate: modifyShoppingDate,
            shoppingMemo: modifyShoppingMemo,
            estimatedBudget: modifyEstimatedBudget,
            shoppingDatumId: modyfyShoppingDatumId,
          };
          await shoppingDatumUpdate(shoppingDataParams);
          setLoading(false);
          showMessage({ title: `お買い物メモの修正が完了しました。`, status: "success" });
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        setLoading(false);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    }
  };
  return updateShoppingData;
};