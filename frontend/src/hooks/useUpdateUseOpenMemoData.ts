import React, { useCallback } from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { MergeParams, OkaimonoMemoDataShowResponse, OkaimonoShopDataResponse } from "interfaces";
import { shopCreateOpenTrue } from "lib/api/post";
import { shoppingDatumUpdateOpenTrue } from "lib/api/update";
import { UseFormSetValue } from "react-hook-form";

type Props = {
  // eslint-disable-next-line no-unused-vars
  setReadOnly: (value: React.SetStateAction<boolean>) => void;
  readOnly: boolean;
  // eslint-disable-next-line no-unused-vars
  setLoading: (value: React.SetStateAction<boolean>) => void;
  shoppingDatumFormData: MergeParams;
  setValue: UseFormSetValue<MergeParams>;
  userId: string;
  // setShoppingDatumValues: React.Dispatch<React.SetStateAction<OkaimonoMemoData | undefined>>;
};

export const useUpdateUseOpenMemoData = () => {
  const { showMessage } = useMessage();

  const updateMemoOpenData = useCallback(
    async (props: Props) => {
      const { setReadOnly, readOnly, setLoading, shoppingDatumFormData, setValue, userId } =
        props;
      const { modifyShopName, modifyShoppingDate, modifyShoppingMemo, modifyEstimatedBudget, modyfyShoppingDatumId } =
        shoppingDatumFormData;

      setReadOnly(!readOnly);
      if (!readOnly) {
        setLoading(true);

        const shopParams: MergeParams = { shopName: modifyShopName || "お店名称未設定でのお買い物", userId };
        try {
          const shopUpdateRes: OkaimonoShopDataResponse = await shopCreateOpenTrue(shopParams);
          if (shopUpdateRes.status === 200) {
            const shopId = shopUpdateRes.data.id;
            const shoppingDataParams: MergeParams = {
              shopId,
              userId,
              shoppingDate: modifyShoppingDate,
              shoppingMemo: modifyShoppingMemo,
              estimatedBudget: modifyEstimatedBudget,
              shoppingDatumId: modyfyShoppingDatumId,
            };
            const updateRes: OkaimonoMemoDataShowResponse = await shoppingDatumUpdateOpenTrue(shoppingDataParams);
            if (updateRes && updateRes.status === 200) {
              // setShoppingDatumValues(updateRes.data);
              setValue("shoppingDate", updateRes.data.shoppingDate);
              setValue("shopName", shopUpdateRes.data.shopName);
              setValue("estimatedBudget", updateRes.data.estimatedBudget);
            }
            setLoading(false);
            showMessage({ title: `お買い物メモの修正が完了しました。`, status: "success" });
          }
        } catch (err) {
          const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
          console.error(axiosError.response);
          setLoading(false);
          showMessage({ title: "エラーが発生しました。", status: "error" });
        }
      }
    },
    [shopCreateOpenTrue, shoppingDatumUpdateOpenTrue]
  );
  return updateMemoOpenData;
};
