import React from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import {
  ListFormParams,
  MergeParams,
  OkaimonoMemoData,
  OkaimonoMemosData,
  OkaimonoShopModifingData,
} from "interfaces";
import {
  memosShowOpenTrue,
  shoppingDatumShowOpenTrue,
  shopShowOpenTrue,
} from "lib/api/show";
import { FieldArrayWithId, UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  shoppingDatumId: string;
  setShoppingDatumValues: React.Dispatch<React.SetStateAction<OkaimonoMemoData | undefined>>;
  setValue: UseFormSetValue<MergeParams>;
  setShopDataValues: React.Dispatch<React.SetStateAction<OkaimonoShopModifingData | undefined>>;
  setListValues: React.Dispatch<React.SetStateAction<OkaimonoMemosData[] | undefined>>;
  append: UseFieldArrayAppend<MergeParams, "listForm">;
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  userId: string;
};

export const useGetUseMemoListOpenData = () => {
  const { showMessage } = useMessage();

  const getShoppingMemoList = async (props: Props) => {
    const {
      setLoading,
      fields,
      shoppingDatumId,
      setShoppingDatumValues,
      setValue,
      setShopDataValues,
      setListValues,
      append,
      userId,
    } = props;

    setLoading(true);
    if (userId) {
      const memosProps = {
        userId,
        shoppingDatumId,
      };
      try {
        const shoppingDatumRes = await shoppingDatumShowOpenTrue(memosProps);
        if (shoppingDatumRes?.status === 200) {
          setShoppingDatumValues(shoppingDatumRes.data);
          setValue("shoppingDate", shoppingDatumRes.data.shoppingDate);
          setValue("shoppingDatumId", shoppingDatumId);
          setValue("estimatedBudget", shoppingDatumRes.data.estimatedBudget);
          setValue("isFinish", true);
          const shopProps = {
            userId,
            shopId: shoppingDatumRes.data.shopId,
          };
          const getShop = await shopShowOpenTrue(shopProps);
          if (getShop && getShop.status === 200) {
            const shopResponse = getShop;
            setShopDataValues(shopResponse.data);
            setValue("shopName", shopResponse.data.shopName);
            const listProps = {
              userId,
              shoppingDatumId,
            };
            const getList = await memosShowOpenTrue(listProps);
            if (getList && getList.status === 200) {
              const listResponse = getList;
              setListValues(listResponse.data);
              for (let i = fields.length; i < listResponse.data.length; i++) {
                append({ purchaseName: "", price: "", shoppingDetailMemo: "", amount: "", id: "", asc: "" });
              }
              listResponse.data.forEach((list: ListFormParams, index: number) => {
                setValue(`listForm.${index}.price`, list.price);
                setValue(`listForm.${index}.amount`, list.amount);
                setValue(`listForm.${index}.purchaseName`, list.purchaseName);
                setValue(`listForm.${index}.amount`, list.amount);
                setValue(`listForm.${index}.id`, list.id);
                setValue(`listForm.${index}.asc`, list.asc);
              });
            }
          }
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.error, status: "error" });
      }
    }
  };
  return getShoppingMemoList;
};
