import { Box } from "@chakra-ui/react";
import { useGetOkaimonoShow } from "hooks/useGetOkaimonoShow";
import {
  OkaimonoMemoDataShowResponse,
  OkaimonoMemoResponse,
  OkaimonoShopDataResponse,
} from "interfaces";
import { memoProps, memosShow, shopPropsType, shopShow } from "lib/api/show";
import { memo, useEffect, useState, VFC } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

export const OkaimonoShow: VFC = memo(() => {
  const { id } = useParams<{ id?: string }>();
  const getOkaimonoShow = useGetOkaimonoShow(id);
  const [shopData, setShopData] = useState<OkaimonoShopDataResponse>();
  const [shoppingData, setShoppingData] = useState<OkaimonoMemoDataShowResponse>();
  const [memosData, setMemosData] = useState<OkaimonoMemoResponse>();

  useEffect(() => {
    const showMemo = async () => {
      try {
        const shoppingRes: OkaimonoMemoDataShowResponse | undefined = await getOkaimonoShow();
        setShoppingData(shoppingRes);
        console.log(shoppingRes);
        if (shoppingRes?.status === 200) {
          const shopProps: shopPropsType = {
            userId: shoppingRes.data.userId,
            shopId: shoppingRes.data.shopId,
          };
          const shopRes: OkaimonoShopDataResponse = await shopShow(shopProps);
          setShopData(shopRes);
          if (shopRes.status === 200) {
            const memosProps: memoProps = {
              userId: shoppingRes.data.userId,
              shoppingDataId: shoppingRes.data.id,
            };
            const memosRes: OkaimonoMemoResponse = await memosShow(memosProps);
            setMemosData(memosRes);
          }
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
      }
    };
    showMemo();
  }, []);
  console.log("shopデータ", shopData);
  console.log(shoppingData);
  console.log(memosData);
  return <Box>{shopData?.data.id}</Box>;
});
