import { Box, Show } from "@chakra-ui/react";
import { useGetOkaimonoShow } from "hooks/useGetOkaimonoShow";
import { memosShow, shopShow } from "lib/api/show";
import { memo, useEffect, useState, VFC } from "react";
import { useParams } from "react-router-dom";

export const OkaimonoShow: VFC = memo(() => {
  const { id } = useParams<{ id: any }>();
  const getOkaimonoShow = useGetOkaimonoShow(id);

  const [shopData, setShopData] = useState<{ data: any }>();
  const [shoppingData, setShoppingData] = useState<{ data: any }>();
  const [memosData, setMemosData] = useState<{ data: any }>();

  useEffect(() => {
    const showMemo = async () => {
      try {
        const shoppingRes: any = await getOkaimonoShow();
        setShoppingData(shoppingRes);
        if (shoppingRes?.status === 200) {
          const shopProps = {
            userId: shoppingRes.data.userId,
            shopId: shoppingRes.data.shopId,
          };
          const shopRes = await shopShow(shopProps);
          setShopData(shopRes);
          if (shopRes.status === 200) {
            const memosProps = {
              userId: shoppingRes.data.userId,
              shoppingDataId: shoppingRes.data.id,
            };
            const memosRes = await memosShow(memosProps);
            setMemosData(memosRes);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    showMemo();
  }, []);
  console.log(shopData);
  console.log(shoppingData);
  console.log(memosData);
  return <Box>{shopData?.data.id}</Box>;
});
