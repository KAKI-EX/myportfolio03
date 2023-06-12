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
        setValue("shoppingDate", shoppingRes.data.shoppingDate);
        setValue("estimatedBudget", shoppingRes.data.estimatedBudget);
        setValue("shoppingMemo", shoppingRes.data.shoppingMemo);
        setValue("shoppingDatumId", shoppingRes.data.id);
        setValue("isOpen", shoppingRes.data.isOpen);
        const shopProps: shopPropsType = {
          shopId: shoppingRes.data.shopId,
        };
        const shopRes: OkaimonoShopDataResponse = await shopShow(shopProps);
        if (shopRes.status === 200) {
          setValue("shopName", shopRes.data.shopName);
          const memosProps: memoProps = {
            shoppingDataId: shoppingRes.data.id,
          };
          const memosRes: OkaimonoMemosDataResponse = await memosShow(memosProps);
          for (let i = fields.length; i < memosRes.data.length; i++) {
            append({
              purchaseName: "",
              price: "",
              shoppingDetailMemo: "",
              amount: "",
              id: "",
              expiryDateStart: "",
              expiryDateEnd: "",
            });
          }
          memosRes.data.forEach((m, index) => {
            setValue(`listForm.${index}.purchaseName`, m.purchaseName);
            setValue(`listForm.${index}.price`, m.price);
            setValue(`listForm.${index}.shoppingDetailMemo`, m.shoppingDetailMemo);
            setValue(`listForm.${index}.amount`, m.amount);
            setValue(`listForm.${index}.id`, m.id);
            setValue(`listForm.${index}.expiryDateStart`, m.expiryDateStart);
            setValue(`listForm.${index}.expiryDateEnd`, m.expiryDateEnd);
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
