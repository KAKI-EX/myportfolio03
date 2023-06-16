import { AxiosError } from "axios";
import { MergeParams, ListFormParams } from "interfaces";
import { memoProps, memosShow, shoppingDatumShow, shopPropsType, shopShow } from "lib/api/show";
import React from "react";
import { FieldArrayWithId, UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";

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

  const showMemo = async () => {
    setLoading(true);
    try {
      if (id) {
        const shoppingDatumProps = { shoppingDataId: id };
        const getShopping = await shoppingDatumShow(shoppingDatumProps);
        if (getShopping?.status === 200) {
          setValue("shoppingDate", getShopping.data.shoppingDate);
          setValue("estimatedBudget", getShopping.data.estimatedBudget);
          setValue("shoppingMemo", getShopping.data.shoppingMemo);
          setValue("shoppingDatumId", getShopping.data.id);
          setValue("isOpen", getShopping.data.isOpen);
          const shopProps: shopPropsType = {
            shopId: getShopping.data.shopId,
          };
          const getShopDatum = await shopShow(shopProps);
          if (getShopDatum && getShopDatum.status === 200) {
            const shopResponse = getShopDatum;
            setValue("shopName", shopResponse.data.shopName);
            const memosProps: memoProps = {
              shoppingDataId: getShopping.data.id,
            };
            const getList = await memosShow(memosProps);
            if (getList && getList.status === 200) {
              const listResponse = getList;
              for (let i = fields.length; i < listResponse.data.length; i++) {
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
              listResponse.data.forEach((data: ListFormParams, index: number) => {
                setValue(`listForm.${index}.purchaseName`, data.purchaseName);
                setValue(`listForm.${index}.price`, data.price);
                setValue(`listForm.${index}.shoppingDetailMemo`, data.shoppingDetailMemo);
                setValue(`listForm.${index}.amount`, data.amount);
                setValue(`listForm.${index}.id`, data.id);
                setValue(`listForm.${index}.expiryDateStart`, data.expiryDateStart);
                setValue(`listForm.${index}.expiryDateEnd`, data.expiryDateEnd);
                if (data.expiryDateStart) {
                  setExpiryDate(true);
                }
              });
            }
          }
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
