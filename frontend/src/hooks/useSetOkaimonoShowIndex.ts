import { AxiosError } from "axios";
import {
  MergeParams,
  OkaimonoMemoDataShowResponse,
  OkaimonoShopDataResponse,
  OkaimonoMemosDataResponse,
} from "interfaces";
import Cookies from "js-cookie";
import { memoProps, memosShow, shopPropsType, shopShow } from "lib/api/show";
import React from "react";
import { FieldArrayWithId, UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";
import { useGetOkaimonoShow } from "./useGetOkaimonoShow";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
  setValue: UseFormSetValue<MergeParams>;
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  append: UseFieldArrayAppend<MergeParams, "listForm">;
  setExpiryDate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useSetOkaimonoShowIndex = (props: Props) => {
  const { setLoading, id, setValue, fields, append, setExpiryDate } = props;
  const getOkaimonoShow = useGetOkaimonoShow(id);

  const showMemo = async () => {
    setLoading(true);
    try {
      const shoppingRes: OkaimonoMemoDataShowResponse | undefined = await getOkaimonoShow();
      if (shoppingRes?.status === 200) {
        setValue("shopping_date", shoppingRes.data.shoppingDate);
        setValue("estimated_budget", shoppingRes.data.estimatedBudget);
        setValue("shopping_memo", shoppingRes.data.shoppingMemo);
        setValue("shopping_datum_id", shoppingRes.data.id);
        const shopProps: shopPropsType = {
          userId: shoppingRes.data.userId,
          shopId: shoppingRes.data.shopId,
        };
        const shopRes: OkaimonoShopDataResponse = await shopShow(shopProps);
        if (shopRes.status === 200) {
          setValue("shop_name", shopRes.data.shopName);
          const memosProps: memoProps = {
            userId: shoppingRes.data.userId,
            shoppingDataId: shoppingRes.data.id,
          };
          const memosRes: OkaimonoMemosDataResponse = await memosShow(memosProps);
          for (let i = fields.length; i < memosRes.data.length; i++) {
            append({
              purchase_name: "",
              price: "",
              shopping_detail_memo: "",
              amount: "",
              id: "",
              expiry_date_start: "",
              expiry_date_end: "",
            });
          }
          memosRes.data.forEach((m, index) => {
            setValue(`listForm.${index}.purchase_name`, m.purchaseName);
            setValue(`listForm.${index}.price`, m.price);
            setValue(`listForm.${index}.shopping_detail_memo`, m.shoppingDetailMemo);
            setValue(`listForm.${index}.amount`, m.amount);
            setValue(`listForm.${index}.id`, m.id);
            setValue(`listForm.${index}.expiry_date_start`, m.expiryDateStart);
            setValue(`listForm.${index}.expiry_date_end`, m.expiryDateEnd);
            if (m.expiryDateStart) {
              setExpiryDate(true);
            }
          });
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error(axiosError.response);
    }
    setLoading(false);
  };
  return showMemo;
};
