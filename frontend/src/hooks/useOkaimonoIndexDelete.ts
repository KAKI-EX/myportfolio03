import { OkaimonoMemoData } from "interfaces";
import { shoppingDataDelete } from "lib/api/destroy";
import { shoppingDataIndex } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React, { useCallback } from "react";

type Props = {
  onCloseAlert: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  inCompleteMemo: OkaimonoMemoData[] | null | undefined;
  setInCompleteMemo: React.Dispatch<React.SetStateAction<OkaimonoMemoData[] | null | undefined>>;
  readyShoppingMemo: OkaimonoMemoData[] | null | undefined;
  setReadyShoppingMemo: React.Dispatch<React.SetStateAction<OkaimonoMemoData[] | null | undefined>>;
  finishedMemo: OkaimonoMemoData[] | null | undefined;
  setFinishedMemo: React.Dispatch<React.SetStateAction<OkaimonoMemoData[] | null | undefined>>;
};

export const useOkaimonoIndexDelete = (customHookProps: Props) => {
  const { showMessage } = useMessage();
  const {
    onCloseAlert,
    inCompleteMemo,
    setInCompleteMemo,
    readyShoppingMemo,
    setReadyShoppingMemo,
    finishedMemo,
    setFinishedMemo,
    setLoading,
  } = customHookProps;

  const deleteShopData = useCallback(
    async (deleteId: OkaimonoMemoData) => {
      setLoading(true);
      onCloseAlert();
      const { id } = deleteId;
      try {
        await shoppingDataDelete(id);
        const shoppingDataRes = await shoppingDataIndex();
        if (shoppingDataRes && shoppingDataRes.status !== 204 && inCompleteMemo?.find((item) => item.id === id)) {
          if (shoppingDataRes) {
            const isFinishNull = shoppingDataRes.data
              .filter((resData: OkaimonoMemoData) => resData.isFinish === null)
              .map((nullList: OkaimonoMemoData) => {
                const inCompleteData = { ...nullList };
                return inCompleteData;
              });
            setInCompleteMemo(isFinishNull);
            setLoading(false);
          }
        } else if (
          shoppingDataRes &&
          shoppingDataRes.status !== 204 &&
          readyShoppingMemo?.find((item) => item.id === id)
        ) {
          if (shoppingDataRes) {
            const isFinishFalse = shoppingDataRes.data
              .filter((resData: OkaimonoMemoData) => resData.isFinish === false)
              .map((falseList: OkaimonoMemoData) => {
                const readyShopping = { ...falseList };
                return readyShopping;
              });
            setReadyShoppingMemo(isFinishFalse);
            setLoading(false);
          }
        } else if (shoppingDataRes && shoppingDataRes.status !== 204 && finishedMemo?.find((item) => item.id === id)) {
          if (shoppingDataRes) {
            const isFinishTrue = shoppingDataRes.data
              .filter((resData: OkaimonoMemoData) => resData.isFinish === true)
              .map((trueList: OkaimonoMemoData) => {
                const finishedShopping = { ...trueList };
                return finishedShopping;
              });
            setFinishedMemo(isFinishTrue);
            setLoading(false);
          }
        } else {
          setInCompleteMemo(null);
          setReadyShoppingMemo(null);
          setFinishedMemo(null);
          setLoading(false);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.errors, status: "error" });
        setLoading(false);
      }
    },
    [inCompleteMemo, readyShoppingMemo, finishedMemo]
  );
  return deleteShopData;
};
