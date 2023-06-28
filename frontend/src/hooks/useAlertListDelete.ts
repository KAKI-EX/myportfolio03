import { AxiosError } from "axios";
import { alertParams, ListFormParams } from "interfaces";
import { alertListDelete } from "lib/api/update";
import React from "react";
import { useGetAlertList } from "hooks/useGetAlertList";
import { useMessage } from "./useToast";

type Props = {
  setLoading: (value: React.SetStateAction<boolean>) => void;
  setAlertLists: React.Dispatch<React.SetStateAction<ListFormParams[] | undefined>>;
  clickAlertDelete: boolean;
  formData: alertParams;
  alertLists: ListFormParams[] | undefined;
};

export const useAlertListDelete = () => {
  const { showMessage } = useMessage();
  const getAlert = useGetAlertList();

  let deleteIndexNum: number[] = [];
  let deleteIds: { listId: string }[] = [];

  const updateIsDisplay = async (props: Props) => {
    const { setLoading, setAlertLists, clickAlertDelete, formData, alertLists } = props;

    const getAlertProps = {
      setLoading,
      setAlertLists,
    };
    try {
      if (
        !clickAlertDelete &&
        formData.listForm?.find((item) => item.isDelete === true) &&
        Array.isArray(formData.listForm)
      ) {
        setLoading(true);
        formData.listForm.forEach((form, index) => {
          if (form.isDelete === true) {
            console.log("index", index);
            deleteIndexNum = [...deleteIndexNum, index];
            if (alertLists) {
              deleteIndexNum.forEach((num) => {
                const deleteTarget = alertLists[num].id;
                if (deleteTarget !== undefined) {
                  deleteIds = [...deleteIds, { listId: deleteTarget }];
                }
              });
            }
          }
        });
        await alertListDelete(deleteIds);
        getAlert(getAlertProps);
        setLoading(false);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error(axiosError.response);
      showMessage({ title: axiosError.response?.data.error, status: "error" });
      setLoading(false);
    }
  };
  return updateIsDisplay;
};
