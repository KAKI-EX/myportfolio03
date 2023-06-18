import React from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { ListFormParams, MergeParams } from "interfaces";
import { memosUpdate } from "lib/api/update";

type Props = {
  setReadOnly: (value: React.SetStateAction<boolean>) => void;
  readOnly: boolean;
  setLoading: (value: React.SetStateAction<boolean>) => void;
  oneListFormData: MergeParams;
};

export const useUpdateUseSingleListData = () => {
  const { showMessage } = useMessage();

  const updateListData = async (props: Props) => {
    const { setReadOnly, readOnly, setLoading, oneListFormData } = props;
    setReadOnly(!readOnly);
    if (!readOnly) {
      setLoading(true);
      try {
        const listParams: ListFormParams = {
          memoId: oneListFormData.modifyId,
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
        await memosUpdate([listParams]);
        setLoading(false);
        showMessage({ title: `お買い物リストの修正が完了しました。`, status: "success" });
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        setLoading(false);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    }
  };
  return updateListData;
};
