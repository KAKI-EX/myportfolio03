import { ListFormParams, OkaimonoMemoData, OkaimonoMemoResponse } from "interfaces";
import { shoppingDataIndex } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React from "react";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setInCompleteMemo: React.Dispatch<React.SetStateAction<OkaimonoMemoData[] | null | undefined>>;
  setOkaimonoMemo: React.Dispatch<React.SetStateAction<OkaimonoMemoResponse | null | undefined>>;
  setReadyShoppingMemo: React.Dispatch<React.SetStateAction<OkaimonoMemoData[] | null | undefined>>;
  setFinishedMemo: React.Dispatch<React.SetStateAction<OkaimonoMemoData[] | null | undefined>>;
};

export const useGetOkaimonoIndex = () => {
  const { showMessage } = useMessage();

  const getIndex = async (props: Props) => {
    const { setLoading, setInCompleteMemo, setOkaimonoMemo, setReadyShoppingMemo, setFinishedMemo } = props;
    try {
      setLoading(true);
      const indexRes = await shoppingDataIndex();
      if (indexRes) {
        const isFinishNull = indexRes.data // 一時保存中のメモリストデータ
          .filter((resData: ListFormParams) => resData.isFinish === null)
          .map((nullList: ListFormParams) => {
            const inCompleteData = { ...nullList };
            return inCompleteData;
          });

        const isFinishFalse = indexRes.data // 買い物予定のメモリストデータ
          .filter((resData: ListFormParams) => resData.isFinish === false)
          .map((falseList: ListFormParams) => {
            const readyShopping = { ...falseList };
            return readyShopping;
          });

        const isFinishTrue = indexRes.data // 買い物が終了したメモリストデータ
          .filter((resData: ListFormParams) => resData.isFinish === true)
          .map((trueList: ListFormParams) => {
            const finishedShopping = { ...trueList };
            return finishedShopping;
          });

        setInCompleteMemo(isFinishNull);
        setOkaimonoMemo(indexRes);
        setReadyShoppingMemo(isFinishFalse);
        setFinishedMemo(isFinishTrue);
        setLoading(false);
      }
      if (indexRes?.data.length === 0) {
        showMessage({ title: "まだメモが登録されていません", status: "info" });
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error(axiosError.response);
      showMessage({ title: axiosError.response?.data.errors, status: "error" });
      setLoading(false);
    }
  };
  return getIndex;
};
