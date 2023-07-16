import React from "react";
import { AxiosError } from "axios";
import { useMessage } from "hooks/useToast";
import { ListFormParams, UseFormOnSearchPage } from "interfaces";
import { shoppingDataIndexRecordByPurchase, shoppingDataIndexRecordByShop } from "lib/api";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOkaimonoRecord: React.Dispatch<React.SetStateAction<ListFormParams[]>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  originFormData: UseFormOnSearchPage;
  searchCurrentPage: number;
  setClickOnSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useGetCustomSearchIndex = () => {
  const { showMessage } = useMessage();

  const getCustomSearchIndex = async (props: Props) => {
    const {
      setLoading,
      setOkaimonoRecord,
      setTotalPages,
      setCurrentPage,
      originFormData,
      searchCurrentPage,
      setClickOnSearch,
    } = props;
    setCurrentPage(1);
    const formData = { ...originFormData, searchCurrentPage };
    if (formData.searchSelect === "shopName") {
      try {
        setClickOnSearch(true);
        const shoppingSearchByShopRes = await shoppingDataIndexRecordByShop(formData);
        if (shoppingSearchByShopRes?.status === 200 && shoppingSearchByShopRes) {
          setOkaimonoRecord(shoppingSearchByShopRes.data.records);
          setTotalPages(shoppingSearchByShopRes.data.totalPages);
          setLoading(false);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.error, status: "error" });
        setLoading(false);
      }
    } else if (formData.searchSelect === "purchaseName") {
      try {
        setClickOnSearch(true);
        const shoppingSearchByPurchaseRes = await shoppingDataIndexRecordByPurchase(formData);
        if (shoppingSearchByPurchaseRes?.status === 200 && shoppingSearchByPurchaseRes) {
          setOkaimonoRecord(shoppingSearchByPurchaseRes.data.records);
          setTotalPages(shoppingSearchByPurchaseRes.data.totalPages);
          setLoading(false);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.error, status: "error" });
        setLoading(false);
      }
    }
  };
  return getCustomSearchIndex;
};
