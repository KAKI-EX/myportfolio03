import React from "react";
import { AxiosError } from "axios";
import { shopsShow } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { OkaimonoShopsDataResponse } from "interfaces";
import { useCookie } from "./useCookie";

type SetShopsIndex = React.Dispatch<React.SetStateAction<OkaimonoShopsDataResponse | undefined>>;

export const useGetShopIndex = (setShopsIndex: SetShopsIndex) => {
  const { separateCookies } = useCookie();
  const { showMessage } = useMessage();

  const getShopsIndex = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true);
    try {
      const res = await shopsShow();
      setShopsIndex(res);
      if (res?.data.length === 0) {
        showMessage({ title: "まだメモが登録されていません", status: "info" });
      }
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error(axiosError.response);
      showMessage({ title: "エラーが発生しました。", status: "error" });
      setLoading(false);
    }
  };
  return getShopsIndex;
};
