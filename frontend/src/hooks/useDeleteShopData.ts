import { OkaimonoShopModifingData, OkaimonoShopsDataResponse } from "interfaces";
import { shopDelete } from "lib/api/destroy";
import { shopsShow } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React from "react";

type Props = {
  onDeleteDialogClose: () => void;
  setShopsIndex: React.Dispatch<React.SetStateAction<OkaimonoShopsDataResponse | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useDeleteShopData = (props: Props) => {
  const { showMessage } = useMessage();
  const { onDeleteDialogClose, setShopsIndex, setLoading } = props;

  const deleteShopData = async (formData: OkaimonoShopModifingData) => {
    const { userId, id } = formData;
    onDeleteDialogClose();
    if (id) {
      setLoading(true);
      try {
        const updatedShop = await shopDelete(userId, id);
        const setResIndexPage = await shopsShow(userId);
        setShopsIndex(setResIndexPage);
        setLoading(false);
        showMessage({ title: updatedShop.data.message, status: "success" });
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        setLoading(false);
        showMessage({ title: axiosError.response?.data.errors, status: "error" });
      }
    } else {
      setLoading(false);
      showMessage({ title: "予期しないエラーが発生しました", status: "error" });
    }
  };
  return deleteShopData;
};
