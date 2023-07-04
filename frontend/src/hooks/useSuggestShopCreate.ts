import { OkaimonoShopsIndexData } from "interfaces";

import { shopsSearchSuggestions } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React from "react";

type Props = {
  shopNameValue: string;
  setShopNameSuggestions: React.Dispatch<React.SetStateAction<OkaimonoShopsIndexData[]>>;
};

export const useSuggestShopCreate = () => {
  const { showMessage } = useMessage();

  const getSuggestionsShopName = async (props: Props) => {
    const { shopNameValue, setShopNameSuggestions } = props;
    try {
      if (shopNameValue) {
        const shopRes = await shopsSearchSuggestions(shopNameValue);
        if (shopRes?.status === 200 && shopRes) {
          setShopNameSuggestions(shopRes.data);
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: "エラーが発生しました。", status: "error" });
    }
  };
  return getSuggestionsShopName;
};
