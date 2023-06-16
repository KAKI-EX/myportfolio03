import { ListFormParams, OkaimonoMemoData, OkaimonoMemoDataShowResponse } from "interfaces";

import { shoppingDatumShow } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React, { useCallback } from "react";
import { FieldValues, UseFormSetValue } from "react-hook-form";

type Props = {
  setOpenMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setValue: UseFormSetValue<FieldValues>;
  onOpenUrl: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  shoppingDataId: string;
  event: React.MouseEvent<Element, MouseEvent>;
};

export const useGetOpenUrl = (readyShoppingMemo: OkaimonoMemoData[] | null | undefined) => {
  const { showMessage } = useMessage();

  const getOpenUrl = useCallback(
    async (props: Props) => {
      const { setOpenMessage, setValue, onOpenUrl, setLoading, shoppingDataId, event } = props;
      event.preventDefault();
      try {
        const result = await shoppingDatumShow({ shoppingDataId });
        if (result && result.status === 200) {
          const shoppingDatumShowRes: OkaimonoMemoDataShowResponse = result;
          if (shoppingDatumShowRes.data.isOpen) {
            const url = `/okaimono_memo_use_open/${shoppingDatumShowRes.data.userId}/${shoppingDatumShowRes.data.id}`;
            setOpenMessage("おつかいをお願いしたい人に送ってみましょう");
            setValue("openMemoUrl", url);
            onOpenUrl();
          } else {
            setOpenMessage("公開設定がされていません。確認ページから再設定しましょう");
            setValue("openMemoUrl", "非公開");
            onOpenUrl();
          }
        }
      } catch (err) {
        setLoading(false);
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    },
    [readyShoppingMemo]
  );
  return getOpenUrl;
};
