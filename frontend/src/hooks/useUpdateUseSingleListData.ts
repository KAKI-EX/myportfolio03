import React from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { ListFormParams, MergeParams } from "interfaces";
import { memosUpdate } from "lib/api/update";
import { UseFormSetValue } from "react-hook-form";

type Props = {
  // eslint-disable-next-line no-unused-vars
  // setReadOnly: (value: React.SetStateAction<boolean>) => void;
  // readOnly: boolean;
  // eslint-disable-next-line no-unused-vars
  setLoading: (value: React.SetStateAction<boolean>) => void;
  oneListFormData: MergeParams;
  setValue: UseFormSetValue<MergeParams>;
};

export const useUpdateUseSingleListData = () => {
  const { showMessage } = useMessage();

  const updateListData = async (props: Props) => {
    const { setLoading, oneListFormData, setValue } = props;
    const { indexNumber } = oneListFormData;
    // setReadOnly(!readOnly);

    setLoading(true);
    console.log("oneListFormData", oneListFormData);
    try {
      const listParams: ListFormParams = {
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
      const updateResult = await memosUpdate([listParams]);
      if (updateResult && typeof indexNumber === "number" && updateResult.status === 200) {
        setValue(`listForm.${indexNumber}.purchaseName`, updateResult.data[0].purchaseName);
        setValue(`listForm.${indexNumber}.amount`, updateResult.data[0].amount);
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
  };
  return updateListData;
};
