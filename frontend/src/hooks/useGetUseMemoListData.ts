import React from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import {
  MergeParams,
  OkaimonoMemoDataShow,
  OkaimonoMemosData,
  OkaimonoMemosDataResponse,
  OkaimonoShopModifingData,
} from "interfaces";
import { memosShow, shoppingDatumShow, shopShow } from "lib/api/show";
import { FieldArrayWithId, UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  shoppingDatumId: string;
  setShoppingDatumValues: React.Dispatch<React.SetStateAction<OkaimonoMemoDataShow | undefined>>;
  setValue: UseFormSetValue<MergeParams>;
  setShopDataValues: React.Dispatch<React.SetStateAction<OkaimonoShopModifingData | undefined>>;
  setListValues: React.Dispatch<React.SetStateAction<OkaimonoMemosData[] | undefined>>;
  append: UseFieldArrayAppend<MergeParams, "listForm">;
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
};

export const useGetUseMemoListData = () => {
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
    } = props;

    setLoading(true);
    if (shoppingDatumId) {
      const memosProps = {
        shoppingDatumId,
      };
      try {
        const shoppingDatumRes = await shoppingDatumShow(memosProps);
        if (shoppingDatumRes?.status === 200) {
          setShoppingDatumValues(shoppingDatumRes.data);
          setValue("shoppingDate", shoppingDatumRes.data.shoppingDate);
          setValue("shoppingDatumId", shoppingDatumId);
          setValue("estimatedBudget", shoppingDatumRes.data.estimatedBudget);
          setValue("isFinish", true);
          const shopProps = {
            shopId: shoppingDatumRes.data.shopId,
          };
          const shopRes = await shopShow(shopProps);
          if (shopRes && shopRes.status === 200) {
            setShopDataValues(shopRes.data);
            setValue("shopName", shopRes.data.shopName);
            const listProps = {
              shoppingDatumId,
            };
            const listResponse = await memosShow(listProps);

            if (listResponse && listResponse.status === 200) {
              const shoppingListRes: OkaimonoMemosDataResponse = listResponse;

              setListValues(shoppingListRes.data);
              for (let i = fields.length; i < shoppingListRes.data.length; i++) {
                append({ purchaseName: "", price: "", shoppingDetailMemo: "", amount: "", id: "", asc: "" });
              }
              shoppingListRes.data.forEach((list, index) => {
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
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    }
  };
  return getShoppingMemoList;
};
