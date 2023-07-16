import React from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { ListFormParams } from "interfaces";
import { shoppingDataIndexRecord } from "lib/api";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOkaimonoRecord: React.Dispatch<React.SetStateAction<ListFormParams[]>>;
  currentPage: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const useGetSearchIndex = () => {
  const { showMessage } = useMessage();

  const getOkaimonoRecordIndex = async (props: Props) => {
    const { setLoading, setOkaimonoRecord, currentPage, setTotalPages } = props;
    setLoading(true);
    try {
      const OkaimonoRecordIndexRes = await shoppingDataIndexRecord(currentPage);
      if (OkaimonoRecordIndexRes?.status === 200 && OkaimonoRecordIndexRes) {
        setOkaimonoRecord(OkaimonoRecordIndexRes.data.records);
        setTotalPages(OkaimonoRecordIndexRes.data.totalPages);
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
  return getOkaimonoRecordIndex;
};
