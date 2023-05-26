import { SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, Stack, VStack, Spinner, Heading } from "@chakra-ui/react";
import { DeleteButton } from "components/atoms/DeleteButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import {
  MergeParams,
  OkaimonoMemosDataResponse,
} from "interfaces";
import { memo, useCallback, useEffect, useState, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMessage } from "hooks/useToast";
import { OkaimonoOverview } from "components/molecules/OkaimonoOverview";
import { OkaimonoDetail } from "components/molecules/OkaimonoDetail";
import { useHistory, useParams } from "react-router-dom";
import { memoProps, memosShow } from "lib/api/show";
import { useMemoUpdate } from "hooks/useMemoUpdate";
import { useSetOkaimonoShowIndex } from "hooks/useSetOkaimonoShowIndex";

export const OkaimonoShow: VFC = memo(() => {
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const defaultShoppingDate = new Date();
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });
  const validationNumber = /^[0-9]+$/;
  // ----------------------------------------------------------------------------------------------------------
  const { id } = useParams<{ id?: string }>();
  const [readOnly, setReadOnly] = useState(true);
  const history = useHistory();
  const onClickBack = useCallback(() => history.push("/okaimono"), [history]);
  // ----------------------------------------------------------------------------------------------------------
  // ReactHookFormの機能呼び出し、デフォルト値の設定。
  const {
    setValue,
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<MergeParams>({
    defaultValues: {
      shopping_date: formattedDefaultShoppingDate,
      listForm: [{ purchase_name: "", price: "", shopping_detail_memo: "", amount: "", id: "", asc: "" }],
    },
    criteriaMode: "all",
    mode: "all",
  });

  // ----------------------------------------------------------------------------------------------------------
  // ReactHookFormの機能呼び出し、デフォルト値の設定。
  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  // ----------------------------------------------------------------------------------------------------------
  // メモのindexを取得
  const showMemo = useSetOkaimonoShowIndex({ setLoading, id, setValue, fields, append });
  useEffect(() => {
    showMemo();
  }, []);

  useEffect(() => {
    fields.forEach((field, index) => {
      setValue(`listForm.${index}.asc`, index.toString());
    });
  }, [fields]);

  // ----------------------------------------------------------------------------------------------------------
  // 予算計算
  const shoppingBudgetField = watch("estimated_budget");
  const watchedPriceFields = fields.map((field, index) => ({
    price: watch(`listForm.${index}.price`),
    amount: watch(`listForm.${index}.amount`),
  }));

  // ----------------------------------------------------------------------------------------------------------
  // 予算計算
  // eslint-disable-next-line
  const total_budget = watchedPriceFields.reduce(
    (acc, { price, amount }) => acc + Number(price || "") * Number(amount || "1"),
    0
  );

  // ----------------------------------------------------------------------------------------------------------
  // フォーム追加機能
  const insertInputForm = (index: number) => {
    insert(index + 1, { purchase_name: "", price: "", shopping_detail_memo: "", amount: "", id: "", asc: "" });
  };

  useEffect(() => {
    if (fields.length === 20) {
      showMessage({ title: "メモは最大20件までの追加が可能です。", status: "warning" });
    }
  }, [fields.length]);

  // ---------------------------------------------------------------------------
  // updateを行なうと、編集画面で追加した新規メモがあるとエラーを起こすため、新規メモを検知したのち、Createアクションへ該当メモを送信。
  // Createアクション送信分はsendUpdateToAPIの中で削除している。その後にupdateアクションを行っているため、戻り値の中にCreateアクションの
  // データがない。そのため、sendUpdataToAPIの戻り値の配列0番目のuserIdとshoppingDatumIdを元にShowアクションを実行してsetValueしている。
  // 戻り値をsetValueせずに反映しない方法(リロードすると消える)もあるが、その状態でupdateアクションを再度送ると、仕様上、新規作成アクションで
  // 作成したはずのメモが再度作成されてしまう。(新規メモか否かの判断をmemo_idの有無で検知しているため)
  const props = { setLoading, total_budget };
  const sendUpdateToAPI = useMemoUpdate(props);
  const onSubmit = useCallback(
    async (formData: MergeParams) => {
      setReadOnly(!readOnly);
      if (!readOnly) {
        const result = await sendUpdateToAPI(formData, deleteIds, setDeleteIds);
        const memosProps: memoProps = {
          userId: result?.data[0].userId,
          shoppingDataId: result?.data[0].shoppingDatumId,
        };
        const memosRes: OkaimonoMemosDataResponse = await memosShow(memosProps);
        for (let i = fields.length; i < memosRes.data.length; i++) {
          append({ purchase_name: "", price: "", shopping_detail_memo: "", amount: "", id: "", asc: "" });
        }
        memosRes.data.forEach((m, index) => {
          setValue(`listForm.${index}.purchase_name`, m.purchaseName);
          setValue(`listForm.${index}.price`, m.price);
          setValue(`listForm.${index}.shopping_detail_memo`, m.shoppingDetailMemo);
          setValue(`listForm.${index}.amount`, m.amount);
          setValue(`listForm.${index}.id`, m.id);
        });
      }
    },
    [readOnly, sendUpdateToAPI]
  );

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align="center" justify="center" px={3}>
        <VStack w="100rem">
          <Heading as="h2" size="lg" textAlign="center" pt={3}>
            {readOnly ? "お買い物メモの確認" : "お買い物メモの編集"}
          </Heading>
          <Divider my={4} />
          <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
            お買い物情報
          </Heading>
          <Box>
            <OkaimonoOverview
              register={register}
              validationNumber={validationNumber}
              errors={errors}
              readOnly={readOnly}
            />
            <Divider my={4} />
            <OkaimonoDetail
              fields={fields}
              insertInputForm={insertInputForm}
              SmallCloseIcon={SmallCloseIcon}
              remove={remove}
              register={register}
              errors={errors}
              validationNumber={validationNumber}
              readOnly={readOnly}
              getValues={getValues}
              deleteIds={deleteIds}
              setDeleteIds={setDeleteIds}
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
              <PrimaryButtonForReactHookForm disabled={!isValid}>
                {readOnly ? "編集する" : "保存する"}
              </PrimaryButtonForReactHookForm>
              <DeleteButton onClick={onClickBack}>一覧に戻る</DeleteButton>
            </Stack>
          </VStack>
          <Box h="12.5rem" />
        </VStack>
      </Flex>
    </form>
  );
});
