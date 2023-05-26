import { AxiosError } from "axios";
import { OkaimonoShopModifingData, OkaimonoShopsDataResponse } from "interfaces";
import { shopsShow } from "lib/api/show";
import { shopUpdate } from "lib/api/update";
import { useMessage } from "hooks/useToast";
import { UseFormSetValue } from "react-hook-form";
import React from "react";

type Props = {
  readOnly: boolean;
  setValue: UseFormSetValue<OkaimonoShopModifingData>;
  setShopsIndex: React.Dispatch<React.SetStateAction<OkaimonoShopsDataResponse | undefined>>;
};

export const useUpdateShopData = (props: Props) => {
  const { showMessage } = useMessage();
  const { readOnly, setValue, setShopsIndex } = props;

  const updateShopData = async (formData: OkaimonoShopModifingData) => {
    if (!readOnly) {
      try {
        const makeCustomData: OkaimonoShopModifingData = {
          shopName: formData.shopName,
          shopMemo: formData.shopMemo,
          userId: formData.userId,
          id: formData.shopId,
        };
        const updatedShops = await shopUpdate(makeCustomData);
        setValue("shopName", updatedShops.data.shopName);
        setValue("shopMemo", updatedShops.data.shopMemo);
        setValue("shopId", updatedShops.data.id);
        setValue("userId", updatedShops.data.userId);
        const setResIndexPage = await shopsShow(updatedShops.data.userId);
        setShopsIndex(setResIndexPage);
      } catch (err) {
        const axiosError = err as AxiosError;
        showMessage({ title: axiosError.response?.data.errors, status: "error" });
      }
    }
  };
  return updateShopData;
};
