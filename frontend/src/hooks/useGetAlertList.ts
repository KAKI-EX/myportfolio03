import { AxiosError } from "axios";
import { ListFormParams } from "interfaces";
import { memosAlertShow } from "lib/api/show";
import React from "react";
import { useMessage } from "./useToast";

type Props = {
  // eslint-disable-next-line no-unused-vars
  setLoading: (value: React.SetStateAction<boolean>) => void;
  setAlertLists: React.Dispatch<React.SetStateAction<ListFormParams[] | undefined>>;
};

export const useGetAlertList = () => {
  const { showMessage } = useMessage();

  const getAlert = async (props: Props) => {
    const { setLoading, setAlertLists } = props;
    setLoading(true);
    try {
      const alertRes = await memosAlertShow();
      if (alertRes?.status === 200 && alertRes) {
        const alertListData: ListFormParams[] = alertRes.data;
        setAlertLists(alertListData);
        setLoading(false);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: axiosError.response?.data.error, status: "error" });
      setLoading(false);
    }
  };
  return getAlert;
};
