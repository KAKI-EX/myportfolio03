import React, { useCallback } from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { MergeParams } from "interfaces";
import { memoUpdateOpenTrue } from "lib/api/update";
import { UseFormSetValue } from "react-hook-form";

type Props = {
  // eslint-disable-next-line no-unused-vars
  setReadOnly: (value: React.SetStateAction<boolean>) => void;
  readOnly: boolean;
  // eslint-disable-next-line no-unused-vars
  setLoading: (value: React.SetStateAction<boolean>) => void;
  oneListFormData: MergeParams;
  setValue: UseFormSetValue<MergeParams>;
  userId: string;
};

export const useUpdateUseSingleListOpenData = () => {
  const { showMessage } = useMessage();

  const updateListData = useCallback(
    async (props: Props) => {
      const { setReadOnly, readOnly, setLoading, oneListFormData, setValue, userId } = props;
      setReadOnly(!readOnly);
      const { indexNumber } = oneListFormData;
      if (!readOnly) {
        setLoading(true);
        try {
          const listParams: MergeParams = {
            userId,
            listId: oneListFormData.modifyId,
            shoppingDatumId: oneListFormData.modifyListShoppingDatumId,
            shopId: oneListFormData.modifyShopId,
            purchaseName: oneListFormData.modifyPurchaseName,
            shoppingDetailMemo: oneListFormData.modifyMemo,
            amount: oneListFormData.modifyAmount,
            shoppingDate: oneListFormData.modifyListShoppingDate,
            asc: oneListFormData.modifyAsc,
            expiryDateStart: oneListFormData.modifyExpiryDateStart,
            expiryDateEnd: oneListFormData.modifyExpiryDateEnd,
          };
          const updateResult = await memoUpdateOpenTrue(listParams);
          if (updateResult && typeof indexNumber === "number" && updateResult.status === 200) {
            setValue(`listForm.${indexNumber}.purchaseName`, updateResult.data.purchaseName);
            setValue(`listForm.${indexNumber}.amount`, updateResult.data.amount);
          }
          setLoading(false);
          showMessage({ title: `お買い物リストの修正が完了しました。`, status: "success" });
        } catch (err) {
          const axiosError = err as AxiosError;
          // eslint-disable-next-line no-console
          console.error(axiosError.response);
          setLoading(false);
          showMessage({ title: "エラーが発生しました。", status: "error" });
        }
      }
    },
    [memoUpdateOpenTrue]
  );
  return updateListData;
};
