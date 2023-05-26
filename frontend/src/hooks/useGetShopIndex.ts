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
  const userId = separateCookies("_user_id");

  const getShopsIndex = async () => {
    try {
      if (userId) {
        const res = await shopsShow(userId);
        setShopsIndex(res);
        if (res?.data.length === 0) {
          showMessage({ title: "まだメモが登録されていません", status: "info" });
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error(axiosError.response);
      showMessage({ title: "エラーが発生しました。", status: "error" });
    }
  };
  return getShopsIndex;
};
