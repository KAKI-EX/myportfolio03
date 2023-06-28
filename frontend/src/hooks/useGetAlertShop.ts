import { AxiosError } from "axios";
import { ListFormParams, OkaimonoShopsIndexData } from "interfaces";
import { shopShow } from "lib/api/show";
import React from "react";
import { useMessage } from "./useToast";

type Props = {
  setLoading: (value: React.SetStateAction<boolean>) => void;
  setAlertListShop: React.Dispatch<React.SetStateAction<OkaimonoShopsIndexData | null | undefined>>;
  alertListDetail: ListFormParams | null | undefined;
  onOpen: () => void;
};

export const useGetAlertShop = () => {
  const { showMessage } = useMessage();

  const getShop = async (props: Props) => {
    const { setLoading, setAlertListShop, alertListDetail, onOpen } = props;
    setLoading(true);
    if (alertListDetail) {
      try {
        const alertShopRes = await shopShow({ shopId: alertListDetail.shopId });
        if (alertShopRes?.status === 200 && alertShopRes) {
          setAlertListShop(alertShopRes.data);
          onOpen();
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.error, status: "error" });
        setLoading(false);
      }
    }
    setLoading(false);
  };
  return getShop;
};
