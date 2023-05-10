import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  Stack,
  VStack,
  InputRightElement,
} from "@chakra-ui/react";
import { DeleteButton } from "components/atoms/DeleteButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { OkaimonoParams } from "interfaces";
import { memo, useEffect, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const OkaimonoMemo: VFC = memo(() => {
  const defaultShoppingDate = new Date();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });

  const { register, handleSubmit, control, watch } = useForm<OkaimonoParams>({
    defaultValues: {
      shopping_date: formattedDefaultShoppingDate,
    },
  });

  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  const shoppingBudgetField = watch("estimated_budget");
  const watchedPriceFields = fields.map((field, index) => ({
    price: watch(`listForm.${index}.price`),
    amount: watch(`listForm.${index}.amount`),
  }));
  const totalPrice = watchedPriceFields.reduce(
    (acc, { price, amount }) => acc + Number(price || "") * Number(amount || "1"),
    0
  );

  const insertInputForm = (index: number) => {
    insert(index + 1, { purchase_name: "", price: "", shopping_memo: "", amount: "" });
  };

  useEffect(() => {
    for (let i = 0; i < 2; i++) {
      append({ purchase_name: "", price: "", shopping_memo: "", amount: "" });
    }
  }, [append]);

  const onSubmit = async (formData: OkaimonoParams) => {
    const addTotalPrice = { ...formData, totalPrice };
    console.log(addTotalPrice);
    const { shopping_date, shop_name, estimated_budget, shopping_memo } = formData;
    // const params: OkaimonoParams {
    //   shopName: shopName,
    //   shoppingBudget:
    //   oneWordMemo: string;
    //   shoppingDate?: string | undefined
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align="center" justify="center" px={3}>
        <VStack w="100rem">
          <Box>
            <Heading as="h2" size="lg" textAlign="center" pt={3}>
              お買い物メモの作成
            </Heading>
            <Divider my={4} />
            <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
              お買い物情報
            </Heading>
            <Box bg="white" rounded="xl">
              <Stack align="center" justify="center" py={6} spacing="3" {...register("shopping_date")}>
                <Input size="md" type="date" w="90%" fontSize={{ base: "sm", md: "md" }} />
                <Input
                  placeholder="お店の名前"
                  size="md"
                  w="90%"
                  fontSize={{ base: "sm", md: "md" }}
                  {...register("shop_name")}
                />
                <InputGroup w="90%">
                  <Input
                    size="md"
                    placeholder="お買い物の予算"
                    fontSize={{ base: "sm", md: "md" }}
                    {...register("estimated_budget")}
                  />
                  <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                    円
                  </InputRightElement>
                </InputGroup>
                <Input
                  placeholder="一言メモ"
                  size="md"
                  w="90%"
                  fontSize={{ base: "sm", md: "md" }}
                  {...register("shopping_memo")}
                />
              </Stack>
            </Box>
            <Divider my={4} />
            <Box>
              <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
                お買い物リスト
              </Heading>
              {fields.map((field, index) => (
                <HStack key={field.key} px={2} py={3} w="100%" bg="white" rounded="xl" mb="2">
                  <VStack spacing={1} w="5%">
                    <Box display={fields.length < 20 ? "block" : "none"}>
                      <SmallAddIcon
                        bg="teal.500"
                        rounded="full"
                        color="white"
                        onClick={(event) => {
                          event.preventDefault();
                          insertInputForm(index);
                        }}
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
                        placeholder="買う商品のなまえ"
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        w="100%"
                        {...register(`listForm.${index}.purchase_name`)}
                      />
                    </Box>
                    <Box w="100%">
                      <Input
                        placeholder="メモ"
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        {...register(`listForm.${index}.shopping_memo`)}
                      />
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
                      {...register(`listForm.${index}.amount`)}
                    />
                    <Box w="100%">
                      <InputGroup>
                        <Input
                          placeholder="いくら？"
                          fontSize={{ base: "sm", md: "md" }}
                          {...register(`listForm.${index}.price`)}
                        />
                        <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                          円
                        </InputRightElement>
                      </InputGroup>
                    </Box>
                  </VStack>
                </HStack>
              ))}
            </Box>
          </Box>
          <VStack
            position="fixed"
            bg="rgba(49,151,149,1)"
            align="center"
            justify="center"
            w="90%"
            bottom="1.5%"
            rounded="xl"
            zIndex="10"
            opacity="0.85"
          >
            <Box mt={4}>
              <Box as="p" color="white">
                現在の合計(税別): {totalPrice}円
              </Box>
              <Box as="p" color={Number(shoppingBudgetField || "") < totalPrice ? "red.500" : "white"}>
                お買い物予算残り: {Number(shoppingBudgetField || "") - totalPrice}円
              </Box>
            </Box>
            <Stack w="80%" py="3%">
              <PrimaryButtonForReactHookForm>お買い物リストを確定</PrimaryButtonForReactHookForm>
              <DeleteButton>保存しない</DeleteButton>
            </Stack>
          </VStack>
          <Box h="12.5rem" />
        </VStack>
      </Flex>
    </form>
  );
});
