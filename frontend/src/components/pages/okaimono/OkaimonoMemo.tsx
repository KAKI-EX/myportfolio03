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
import { MergeParams } from "interfaces";
import { memo, useEffect, useState, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMessage } from "hooks/useToast";
import { useMemoCreate } from "hooks/useMemoCreate";
import { OkaimonoOverview } from "components/molecules/OkaimonoOverview";

export const OkaimonoMemo: VFC = memo(() => {
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

  useEffect(() => {
    if (fields.length === 20) {
      showMessage({ title: "メモは最大20件までの追加が可能です。", status: "warning" });
    }
  }, [fields.length]);
  // ---------------------------------------------------------------------------
  // ここでフォームデータの送信処理を行っている。詳細はuseMemoCreateを参照。
  const props = { setLoading, total_budget };
  const sendDataToAPI = useMemoCreate(props);

  const onSubmit = (formData: MergeParams) => {
    sendDataToAPI(formData);
  };
  // ---------------------------------------------------------------------------

  return loading ? (
    <Box h="50rem" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align="center" justify="center" px={3}>
        <VStack w="100rem">
          <Box>
            <OkaimonoOverview register={register} validationNumber={validationNumber} errors={errors} />
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
                          maxLength: { value: 50, message: "最大文字数は50文字までです。" },
                        })}
                      />
                      {errors.listForm && errors.listForm[index]?.purchase_name && (
                        <Box color="red" fontSize="sm">
                          {errors.listForm[index]?.purchase_name?.types?.required}
                          {errors.listForm[index]?.purchase_name?.types?.maxLength}
                        </Box>
                      )}
                    </Box>
                    <Box w="100%">
                      <Input
                        placeholder="メモ"
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        {...register(`listForm.${index}.shopping_detail_memo`, {
                          maxLength: { value: 150, message: "最大文字数は150文字です。" },
                        })}
                      />
                      {errors.listForm && errors.listForm[index]?.shopping_detail_memo && (
                        <Box color="red" fontSize="sm">
                          {errors.listForm[index]?.shopping_detail_memo?.types?.maxLength}
                        </Box>
                      )}
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
                      {...register(`listForm.${index}.amount`, {
                        max: { value: 99, message: "上限は99までです。" },
                        pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                      })}
                    />
                    {errors.listForm && errors.listForm[index]?.amount && (
                      <Box color="red" fontSize="sm">
                        {errors.listForm[index]?.amount?.types?.max}
                        {errors.listForm[index]?.amount?.types?.pattern}
                      </Box>
                    )}
                    <Box w="100%">
                      <InputGroup>
                        <Input
                          placeholder="いくら？"
                          // type="number"
                          fontSize={{ base: "sm", md: "md" }}
                          {...register(`listForm.${index}.price`, {
                            pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                          })}
                        />
                        <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                          円
                        </InputRightElement>
                      </InputGroup>
                    </Box>
                    {errors.listForm && errors.listForm[index]?.price && (
                      <Box color="red" fontSize="sm">
                        {errors.listForm[index]?.price?.types?.pattern}
                      </Box>
                    )}
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
