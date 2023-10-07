import { AxiosError } from "axios";
import { MergeParams, ListFormParams } from "interfaces";
import { memoProps, memosShow } from "lib/api/show";
import React, { useCallback } from "react";
import { FieldArrayWithId, UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";
import { useMessage } from "hooks/useToast";
import { useMemoUpdate } from "./useMemoUpdate";

type ComponentProps = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  totalBudget: number;
  readOnly: boolean;
};

type UpdateProps = {
  setReadOnly: React.Dispatch<React.SetStateAction<boolean>>;
  // expiryDate: boolean;
  // onOpen: () => void;
  formData: MergeParams;
  pushTemporarilyButton: boolean;
  deleteIds: string[];
  setDeleteIds: React.Dispatch<React.SetStateAction<string[]>>;
  append: UseFieldArrayAppend<MergeParams, "listForm">;
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  setValue: UseFormSetValue<MergeParams>;
  setPushTemporarilyButton: React.Dispatch<React.SetStateAction<boolean>>;
  isFinished: boolean | undefined;
};

export const useShowUpdateList = (componentProps: ComponentProps) => {
  const { readOnly, setLoading } = componentProps;
  const { showMessage } = useMessage();
  const sendUpdateToAPI = useMemoUpdate(componentProps);

  const updateList = useCallback(
    async (updateProps: UpdateProps) => {
      const {
        setReadOnly,
        // expiryDate,
        // onOpen,
        formData,
        pushTemporarilyButton,
        deleteIds,
        setDeleteIds,
        append,
        fields,
        setValue,
        setPushTemporarilyButton,
        isFinished,
      } = updateProps;

      setReadOnly(!readOnly);
      // if (readOnly && !expiryDate) {
      //   onOpen();
      // }

      const addFormData = {
        ...formData,
        ...(pushTemporarilyButton ? { isFinish: null } : { isFinish: isFinished ?? false }),
      };
      try {
        if (!readOnly) {
          const result = await sendUpdateToAPI(addFormData, deleteIds, setDeleteIds);
          const memosProps: memoProps = {
            shoppingDatumId: result?.data[0].shoppingDatumId,
          };
          const getList = await memosShow(memosProps);
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
          setPushTemporarilyButton(false);
        }
      } catch (err) {
        setLoading(false);
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    },
    [readOnly, setLoading, showMessage, sendUpdateToAPI]
  );

  return updateList;
};
