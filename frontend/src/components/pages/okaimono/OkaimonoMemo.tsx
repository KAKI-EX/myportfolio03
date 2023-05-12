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
  Spinner,
} from "@chakra-ui/react";
import { DeleteButton } from "components/atoms/DeleteButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { ListFormParams, MergeParams } from "interfaces";
import { memo, useEffect, useState, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { memosCreate, shopCreate, shoppingDatumCreate } from "lib/api/post";
import { useCookie } from "hooks/useCookie";
import { useMessage } from "hooks/useToast";
import { useHistory } from "react-router-dom";

export const OkaimonoMemo: VFC = memo(() => {
  const history = useHistory();
  const { separateCookies } = useCookie();
  const defaultShoppingDate = new Date();
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState(false);
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });
  const validationNumber = /^[0-9]+$/;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<MergeParams>({
    defaultValues: {
      shopping_date: formattedDefaultShoppingDate,
    },
    criteriaMode: "all",
    mode: "all",
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

  // eslint-disable-next-line
  const total_budget = watchedPriceFields.reduce(
    (acc, { price, amount }) => acc + Number(price || "") * Number(amount || "1"),
    0
  );

  const insertInputForm = (index: number) => {
    insert(index + 1, { purchase_name: "", price: "", shopping_detail_memo: "", amount: "" });
  };

  useEffect(() => {
    for (let i = 0; i < 1; i++) {
      append({ purchase_name: "", price: "", shopping_detail_memo: "", amount: "" });
    }
  }, [append]);

  const onSubmit = async (formData: MergeParams) => {
    const user_id = separateCookies("_user_id"); // eslint-disable-line
    const {
      shop_name, // eslint-disable-line
      shopping_date, // eslint-disable-line
      shopping_memo, // eslint-disable-line
      estimated_budget, // eslint-disable-line
      purchase_name, // eslint-disable-line
      price,
      shopping_detail_memo, // eslint-disable-line
      amount,
    } = formData; // eslint-disable-line
    const shopParams: MergeParams = { user_id, shop_name: shop_name || "お店名称未設定でのお買い物" }; // eslint-disable-line

    try {
      setLoading(true);
      const shopCreateRes = await shopCreate(shopParams);
      if (shopCreateRes.status === 200) {
        const shop_id = shopCreateRes.data.id; // eslint-disable-line
        const shoppingDataParams: MergeParams = {
          user_id,
          shop_id,
          shopping_date,
          shopping_memo,
          estimated_budget,
          total_budget,
        };
        const shoppingDatumCreateRes = await shoppingDatumCreate(shoppingDataParams);
        if (shoppingDatumCreateRes.status === 200) {
          const shopping_datum_id = shoppingDatumCreateRes.data.id; // eslint-disable-line
          const memosParams = {
            memos: (formData.listForm || []).map((test: ListFormParams) => {
              return {
                user_id,
                shop_id,
                shopping_datum_id,
                purchase_name: test.purchase_name,
                price: test.price,
                shopping_detail_memo: test.shopping_detail_memo,
                amount: test.amount,
                shopping_date,
              };
            }),
          };

          const memosCreateRes = await memosCreate(memosParams.memos);
          console.log("Memoのレスポンス", memosCreateRes);
          setLoading(false);
          history.push("/okaimono");
          if (formData.listForm) {
            showMessage({ title: `${memosCreateRes.data.length}件のメモを登録しました`, status: "success" });
          }
        }
      }
    } catch (err: any) {
      showMessage({ title: "エラーが発生し、登録ができませんでした。", status: "error" });
      console.error(err.response);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (fields.length === 20) {
      showMessage({ title: "メモは最大20件までの追加が可能です。", status: "warning" });
    }
  }, [fields.length]);

  return loading ? (
    <Box h="50rem" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
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
                    type="number"
                    fontSize={{ base: "sm", md: "md" }}
                    {...register("estimated_budget", {
                      pattern: {
                        value: validationNumber,
                        message: "半角整数で入力してください。",
                      },
                    })}
                  />
                  <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                    円
                  </InputRightElement>
                </InputGroup>
                {errors.estimated_budget && errors.estimated_budget.types?.pattern && (
                  <Box color="red">{errors.estimated_budget.types.pattern}</Box>
                )}
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
                        {...register(`listForm.${index}.purchase_name`, {
                          required: { value: true, message: "商品名が入力されていません" },
                        })}
                      />
                      {errors.listForm && errors.listForm[index]?.purchase_name && (
                        <Box color="red" fontSize="sm">
                          {errors.listForm[index]?.purchase_name?.types?.required}
                        </Box>
                      )}
                    </Box>
                    <Box w="100%">
                      <Input
                        placeholder="メモ"
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        {...register(`listForm.${index}.shopping_detail_memo`)}
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
                          type="number"
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
                現在の合計(税別): {total_budget}円 {/* eslint-disable-line */}
              </Box>
              {/* eslint-disable-next-line */}
              <Box as="p" color={Number(shoppingBudgetField || "") < total_budget ? "red.500" : "white"}>
                {/* eslint-disable-next-line */}
                お買い物予算残り: {Number(shoppingBudgetField || "") - total_budget}円
              </Box>
            </Box>
            <Stack w="80%" py="3%">
              <PrimaryButtonForReactHookForm disabled={!isValid}>お買い物リストを確定</PrimaryButtonForReactHookForm>
              <DeleteButton>保存しない</DeleteButton>
            </Stack>
          </VStack>
          <Box h="12.5rem" />
        </VStack>
      </Flex>
    </form>
  );
});
