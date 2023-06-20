import React, { useCallback } from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { ListFormParams, MergeParams } from "interfaces";
import { FieldArrayWithId, UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";
import { memoProps, memosShowOpenTrue } from "lib/api/show";
import { useHistory } from "react-router-dom";
import { useMemoUpdate } from "./useMemoUpdate";
import { useOpenMemoUpdate } from "./useOpenMemoUpdate";

type HooksProps = {
  totalBudget: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props = {
  deleteIds: string[];
  setDeleteIds: React.Dispatch<React.SetStateAction<string[]>>;
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  append: UseFieldArrayAppend<MergeParams, "listForm">;
  setValue: UseFormSetValue<MergeParams>;
  originFormData: MergeParams;
  userId: string;
};

export const useUpdateUseMemoListOpenData = (hooksProps: HooksProps) => {
  const { setLoading } = hooksProps;
  const { showMessage } = useMessage();
  const sendOpenDataToAPI = useOpenMemoUpdate(hooksProps);
  const history = useHistory();

  const updateMemoListData = useCallback(
    async (props: Props) => {
      const { originFormData, deleteIds, setDeleteIds, fields, append, setValue, userId } = props;
      try {
        const formData = { ...originFormData, userId };
        const result = await sendOpenDataToAPI(formData, deleteIds, setDeleteIds);
        const memosProps: memoProps = {
          userId,
          shoppingDatumId: result?.data[0].shoppingDatumId,
        };
        const getList = await memosShowOpenTrue(memosProps);
        if (getList) {
          const listResponse = getList;
          for (let i = fields.length; i < listResponse.data.length; i++) {
            append({ purchaseName: "", price: "", shoppingDetailMemo: "", amount: "", id: "", asc: "" });
          }
          listResponse.data.forEach((data: ListFormParams, index: number) => {
            setValue(`listForm.${index}.purchaseName`, data.purchaseName);
            setValue(`listForm.${index}.price`, data.price);
            setValue(`listForm.${index}.shoppingDetailMemo`, data.shoppingDetailMemo);
            setValue(`listForm.${index}.amount`, data.amount);
            setValue(`listForm.${index}.id`, data.id);
          });
        }
        history.push("/");
      } catch (err) {
        setLoading(false);
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    },
    [useMemoUpdate]
  );
  return updateMemoListData;
};
