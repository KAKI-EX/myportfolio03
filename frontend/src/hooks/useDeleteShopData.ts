import { OkaimonoShopModifingData, OkaimonoShopsDataResponse } from "interfaces";
import { shopDelete } from "lib/api/destroy";
import { shopsShow } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React from "react";

type Props = {
  onDeleteDialogClose: () => void;
  setShopsIndex: React.Dispatch<React.SetStateAction<OkaimonoShopsDataResponse | undefined>>;
};

export const useDeleteShopData = (props: Props) => {
  const { showMessage } = useMessage();
  const { onDeleteDialogClose, setShopsIndex } = props;

  const deleteShopData = async (formData: OkaimonoShopModifingData) => {
    const { userId, id } = formData;
    onDeleteDialogClose();
    if (id) {
      try {
        const updatedShop = await shopDelete(userId, id);
        const setResIndexPage = await shopsShow(userId);
        setShopsIndex(setResIndexPage);
        showMessage({ title: updatedShop.data.message, status: "success" });
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.errors, status: "error" });
      }
    } else {
      showMessage({ title: "予期しないエラーが発生しました", status: "error" });
    }
  };
  return deleteShopData;
};
