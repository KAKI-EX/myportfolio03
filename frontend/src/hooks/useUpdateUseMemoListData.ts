import React, { useCallback } from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { ListFormParams, MergeParams } from "interfaces";
import { FieldArrayWithId, UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";
import { memoProps, memosShow } from "lib/api/show";
import { useHistory } from "react-router-dom";
import { useMemoUpdate } from "./useMemoUpdate";

type HooksProps = {
  totalBudget: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props = {
  formData: MergeParams;
  deleteIds: string[];
  setDeleteIds: React.Dispatch<React.SetStateAction<string[]>>;
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  append: UseFieldArrayAppend<MergeParams, "listForm">;
  setValue: UseFormSetValue<MergeParams>;
};

export const useUpdateUseMemoListData = (hooksProps: HooksProps) => {
  const { setLoading } = hooksProps;
  const { showMessage } = useMessage();
  const sendUpdateToAPI = useMemoUpdate(hooksProps);
  const history = useHistory();

  const updateMemoListData = useCallback(
    async (props: Props) => {
      const { formData, deleteIds, setDeleteIds, fields, append, setValue } = props;
      try {
        const result = await sendUpdateToAPI(formData, deleteIds, setDeleteIds);
        const memosProps: memoProps = {
          shoppingDatumId: result?.data[0].shoppingDatumId,
        };
        const getAllList = await memosShow(memosProps);
        if (getAllList) {
          const listResponse = getAllList;
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
        history.push("/okaimono");
      } catch (err) {
        setLoading(false);
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    },
    [useMemoUpdate]
  );
  return updateMemoListData;
};
