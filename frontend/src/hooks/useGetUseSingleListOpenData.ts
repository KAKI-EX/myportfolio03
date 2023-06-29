import { GetSingleMemo, MergeParams, OkaimonoMemosData } from "interfaces";

import { memoShowOpenTrue } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React, { useCallback } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  event: React.MouseEvent<Element, MouseEvent>;
  getValues: UseFormGetValues<MergeParams>;
  index: number;
  listValues: OkaimonoMemosData[] | undefined;
  listSetValue: UseFormSetValue<MergeParams>;
  onListOpen: () => void;
  userId: string;
};

export const useGetUseSingleListOpenData = () => {
  const { showMessage } = useMessage();

  const getSingleListData = useCallback(
    async (props: Props) => {
      const { setLoading, event, getValues, index, listValues, listSetValue, onListOpen, userId } = props;
      event.preventDefault();
      setLoading(true);
      if (listValues) {
        try {
          const targetIdToFind = getValues(`listForm.${index}.id`);
          const target = listValues.find((element) => element.id === targetIdToFind);
          if (target) {
            const showOpenProps = {
              userId,
              listId: target.id,
            };
            const getTargetMemo = await memoShowOpenTrue(showOpenProps);
            if (getTargetMemo && target) {
              const listResponse: GetSingleMemo = getTargetMemo;
              listSetValue("modifyPurchaseName", listResponse.data.purchaseName);
              listSetValue("modifyAmount", listResponse.data.amount);
              listSetValue("modifyMemo", listResponse.data.shoppingDetailMemo);
              listSetValue("modifyExpiryDateStart", listResponse.data.expiryDateStart);
              listSetValue("modifyExpiryDateEnd", listResponse.data.expiryDateEnd);
              listSetValue("modifyId", listResponse.data.id);
              listSetValue("modifyAsc", listResponse.data.asc);
              listSetValue("modifyShopId", listResponse.data.shopId);
              listSetValue("modifyListShoppingDate", listResponse.data.shoppingDate);
              listSetValue("modifyListShoppingDatumId", listResponse.data.shoppingDatumId);
              listSetValue("indexNumber", index);
              onListOpen();
              setLoading(false);
            }
          }
        } catch (err) {
          setLoading(false);
          const axiosError = err as AxiosError;
          // eslint-disable-next-line no-console
          console.error(axiosError.response);
          showMessage({ title: "エラーが発生しました。", status: "error" });
        }
      }
    },
    [memoShowOpenTrue]
  );
  return getSingleListData;
};
