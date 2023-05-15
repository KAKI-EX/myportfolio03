import { SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, Stack, VStack, Spinner } from "@chakra-ui/react";
import { DeleteButton } from "components/atoms/DeleteButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { MergeParams } from "interfaces";
import { memo, useContext, useEffect, useState, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMessage } from "hooks/useToast";
import { useMemoCreate } from "hooks/useMemoCreate";
import { OkaimonoOverview } from "components/molecules/OkaimonoOverview";
import { OkaimonoDetail } from "components/molecules/OkaimonoDetail";
import { AuthContext } from "App";

export const OkaimonoMemo: VFC = memo(() => {
  const defaultShoppingDate = new Date();
  const { showMessage } = useMessage();
  const { setLoading, loading } = useContext(AuthContext);
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
      listForm: [{ purchase_name: "", price: "", shopping_detail_memo: "", amount: "" }],
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
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align="center" justify="center" px={3}>
        <VStack w="100rem">
          <Box>
            <OkaimonoOverview register={register} validationNumber={validationNumber} errors={errors} />
            <Divider my={4} />
            <OkaimonoDetail
              fields={fields}
              insertInputForm={insertInputForm}
              SmallCloseIcon={SmallCloseIcon}
              remove={remove}
              register={register}
              errors={errors}
              validationNumber={validationNumber}
            />
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
              <PrimaryButtonForReactHookForm disabled={!isValid}>保存</PrimaryButtonForReactHookForm>
              <DeleteButton>保存しない</DeleteButton>
            </Stack>
          </VStack>
          <Box h="12.5rem" />
        </VStack>
      </Flex>
    </form>
  );
});
