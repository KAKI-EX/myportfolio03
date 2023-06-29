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
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useUpdateShopData = (props: Props) => {
  const { showMessage } = useMessage();
  const { readOnly, setValue, setShopsIndex, setLoading } = props;

  const updateShopData = async (formData: OkaimonoShopModifingData) => {
    if (!readOnly) {
      setLoading(true);
      try {
        const makeCustomData: OkaimonoShopModifingData = {
          shopName: formData.shopName,
          shopMemo: formData.shopMemo,
          id: formData.shopId,
        };
        const updatedShops = await shopUpdate(makeCustomData);
        setValue("shopName", updatedShops.data.shopName);
        setValue("shopMemo", updatedShops.data.shopMemo);
        setValue("shopId", updatedShops.data.id);
        const setResIndexPage = await shopsShow();
        setShopsIndex(setResIndexPage);
        setLoading(false);
        showMessage({ title: "お店情報の更新が完了しました", status: "success" });
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        setLoading(false);
        showMessage({ title: axiosError.response?.data.errors, status: "error" });
      }
    }
  };
  return updateShopData;
};
