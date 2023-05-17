import { Box, Divider, Flex, Heading, HStack, Icon, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { useGetOkaimonoShow } from "hooks/useGetOkaimonoShow";
import { OkaimonoMemoDataShowResponse, OkaimonoMemoResponse, OkaimonoShopDataResponse } from "interfaces";
import { memoProps, memosShow, shopPropsType, shopShow } from "lib/api/show";
import { memo, useEffect, useState, VFC } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { OkaimonoOverview } from "components/molecules/OkaimonoOverview";
import { OkaimonoDetail } from "components/molecules/OkaimonoDetail";
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";

export const OkaimonoShowTest: VFC = memo(() => {
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
  return (
    <Flex align="center" justify="center" px={3}>
      <VStack w="100rem">
        <Heading as="h2" size="lg" textAlign="center" pt={3}>
          お買い物メモの作成
        </Heading>
        <Divider my={4} />
        <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
          お買い物情報
        </Heading>
        <Box>
          {/* <OkaimonoOverview
            shoppingDate={shoppingData?.data.shoppingDate}
            shopName={shopData?.data.shopName}
            estimatedBudget={shoppingData?.data.estimatedBudget}
            shoppingMemo={shoppingData?.data.shoppingMemo}
            readOnly
          /> */}
          <Divider my={4} />
          <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
            お買い物リスト
          </Heading>
          {memosData?.data.map((data) => {
            return (
              <HStack key={data.id} bg="white">
                <VStack spacing={1} w="5%">
                  {/* <Box display={fields.length < 20 ? "block" : "none"}>
                    <SmallAddIcon
                      bg="teal.500"
                      rounded="full"
                      color="white"
                      onClick={(event) => {
                        event.preventDefault();
                        insertInputForm(index);
                      }
                    }
                    />
                  </Box>
                  <Box display={fields.length > 1 ? "block" : "none"}>
                    <Icon
                      as={SmallCloseIcon}
                      bg="red.500"
                      color="white"
                      rounded="full"
                      boxSize={4}
                      onClick={() => remove(index)}
                    />
                  </Box>
                </VStack>
                <VStack w="60%">
                  <Box w="100%">
                    <Input
                      autoFocus={false}
                      placeholder="買う商品のなまえ"
                      fontSize={{ base: "sm", md: "md" }}
                      size="md"
                      w="100%"
                    />
                  </Box>
                  <Box w="100%">
                    <Input placeholder="メモ" fontSize={{ base: "sm", md: "md" }} size="md" />
                  </Box>
                </VStack>
                <VStack w="30%">
                  <Input
                    placeholder="個数"
                    fontSize={{ base: "sm", md: "md" }}
                    size="md"
                    w="100%"
                    type="number"
                    min="1"
                  />
                  <Box w="100%">
                    <InputGroup>
                      <Input
                        placeholder="いくら？"
                        // type="number"
                        fontSize={{ base: "sm", md: "md" }}
                      />
                      <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                        円
                      </InputRightElement>
                    </InputGroup>
                  </Box> */}
                </VStack>
              </HStack>
            );
          })}
        </Box>
      </VStack>
    </Flex>
  );
});
