import { ListFormParams, OkaimonoMemoData, OkaimonoMemoDataShowResponse } from "interfaces";

import { purchaseNameSearchSuggestions } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React from "react";

type Props = {
  purchaseNameValue: string;
  setPurchaseNameSuggestions: React.Dispatch<React.SetStateAction<ListFormParams[]>>;
};

export const useSuggestListCreate = () => {
  const { showMessage } = useMessage();

  const getSuggestionsPurchaseName = async (props: Props) => {
    const { purchaseNameValue, setPurchaseNameSuggestions } = props;
    try {
      if (purchaseNameValue) {
        const purchaseRes = await purchaseNameSearchSuggestions(purchaseNameValue);
        if (purchaseRes?.status === 200 && purchaseRes) {
          setPurchaseNameSuggestions(purchaseRes.data);
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: "エラーが発生しました。", status: "error" });
    }
  };
  return getSuggestionsPurchaseName;
};
