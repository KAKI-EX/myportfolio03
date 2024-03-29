// 店名・商品名のsuggest機能は、第三者に購入履歴の一部を開示することになるため実装していない。
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { MergeParams, OkaimonoMemosData } from "interfaces";
import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ja } from "date-fns/locale";
import { useHistory, useParams } from "react-router-dom";
import { useUpdateUseOpenMemoData } from "hooks/useUpdateUseOpenMemoData";
import { useUpdateUseSingleListOpenData } from "hooks/useUpdateUseSingleListOpenData";
import { useGetUseMemoListOpenData } from "hooks/useGetUseMemoListOpenData";
import { useGetUseSingleListOpenData } from "hooks/useGetUseSingleListOpenData";
import { useUpdateUseMemoListOpenData } from "hooks/useUpdateUseMemoListOpenData";
import { OkaimonoMemoUseMemo } from "components/molecules/OkaimonoMemoUseMemo";
import { OkaimonoMemoUseList } from "components/molecules/OkaimonoMemoUseList";
import { OkaimonoMemoUseCalculate } from "components/molecules/OkaimonoMemoUseCalculate";
import { OkaimonoMemoUseListModal } from "components/molecules/OkaimonoMemoUseListModal";
import { OkaimonoMemoUseMemoModal } from "components/molecules/OkaimonoMemoUseMemoModal";
import { PrimaryButton } from "components/atoms/PrimaryButton";
import { useMessage } from "hooks/useToast";

export const OkaimonoOpenTrue: VFC = memo(() => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listValues, setListValues] = useState<OkaimonoMemosData[]>();
  // const [shoppingDatumValues, setShoppingDatumValues] = useState<OkaimonoMemoData>();
  // const [shopDataValue, setShopDataValues] = useState<OkaimonoShopModifingData>();
  const [deleteIds, setDeleteIds] = useState<string[]>([]);

  const { showMessage } = useMessage();
  const updateMemoOpenData = useUpdateUseOpenMemoData();
  const updateListData = useUpdateUseSingleListOpenData();
  const getShoppingMemoList = useGetUseMemoListOpenData();
  const getSingleListData = useGetUseSingleListOpenData();

  const { isOpen: isShoppingDatumOpen, onClose: closeShoppingDatum } = useDisclosure();
  const { isOpen: isListOpen, onOpen: onListOpen, onClose: closeList } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: closeConfirm } = useDisclosure();

  const defaultShoppingDate = new Date();
  const history = useHistory();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });
  const validationNumber = /^[0-9]+$/;

  const { userId, shoppingDatumId } = useParams<{ userId: string; shoppingDatumId: string }>();

  // ----------------------------------------------------------------------------------------------------------
  // okaimono_memo_useのランディングページ用useForm呼び出し
  const {
    setValue,
    register,
    control,
    watch,
    getValues,
    handleSubmit: allListHandleSubmit,
    formState: { errors },
  } = useForm<MergeParams>({
    defaultValues: {
      shoppingDate: formattedDefaultShoppingDate,
      listForm: [{ price: "", id: "", amount: "", purchaseName: "", asc: "", isBought: false, isFinish: false }],
    },
    criteriaMode: "all",
    mode: "all",
  });

  // ----------------------------------------------------------------------------------------------------------
  // shoppingDatum-編集用のuseForm呼び出し
  const {
    register: shoppingDatumRegister,
    handleSubmit: shoppiingDatumModifyHandleSubmit,
    formState: { errors: shoppingDatumErrors },
  } = useForm<MergeParams>({
    criteriaMode: "all",
    mode: "all",
  });
  // ----------------------------------------------------------------------------------------------------------
  // list-編集用のuseForm呼び出し
  const {
    watch: listWatch,
    setValue: listSetValue,
    register: listRegister,
    handleSubmit: oneListModifyHandleSubmit,
    formState: { errors: listErrors },
  } = useForm<MergeParams>({
    criteriaMode: "all",
    mode: "all",
  });

  const startDate = listWatch(`modifyExpiryDateStart`);
  // ----------------------------------------------------------------------------------------------------------

  // ReactHookFormの機能呼び出し、デフォルト値の設定。
  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  // ----------------------------------------------------------------------------------------------------------

  const shoppingBudgetField = watch("estimatedBudget");
  const watchedPriceFields = fields.map((field, index) => ({
    price: watch(`listForm.${index}.price`),
    amount: watch(`listForm.${index}.amount`),
  }));

  const totalBudget = watchedPriceFields.reduce(
    (acc, { price, amount }) => acc + Number(price || "") * Number(amount || "1"),
    0
  );
  // ----------------------------------------------------------------------------------------------------------
  // shoppingDatumの更新部分。
  const shoppingDatumSubmit = (shoppingDatumFormData: MergeParams) => {
    const updateMemoProps = {
      setReadOnly,
      readOnly,
      setLoading,
      shoppingDatumFormData,
      setValue,
      userId,
      // setShoppingDatumValues,
    };
    updateMemoOpenData(updateMemoProps);
  };

  const onCloseShoppingDatum = () => {
    setReadOnly(true);
    closeShoppingDatum();
  };
  // ----------------------------------------------------------------------------------------------------------
  // リスト情報の単一修正論理式。(右の下矢印から編集を選び、編集する際に呼び出される論理式。)
  const onOneSubmit = async (oneListFormData: MergeParams) => {
    const updateSingleListProps = {
      setReadOnly,
      readOnly,
      setLoading,
      oneListFormData,
      setValue,
      userId,
    };
    updateListData(updateSingleListProps);
  };

  const onCloseList = () => {
    setReadOnly(true);
    closeList();
  };
  // ----------------------------------------------------------------------------------------------------------

  const insertInputForm = (index: number) => {
    insert(index + 1, {
      purchaseName: "",
      price: "",
      shoppingDetailMemo: "",
      amount: "",
      id: "",
      asc: "",
      expiryDateStart: formattedDefaultShoppingDate,
      expiryDateEnd: "",
    });
  };

  // ----------------------------------------------------------------------------------------------------------
  // リスト読み込み部分
  useEffect(() => {
    const memoListProps = {
      setLoading,
      fields,
      shoppingDatumId,
      // setShoppingDatumValues,
      setValue,
      // setShopDataValues,
      setListValues,
      append,
      userId,
    };
    getShoppingMemoList(memoListProps);
  }, []);

  useEffect(() => {
    fields.forEach((field, index) => {
      setValue(`listForm.${index}.asc`, index.toString());
    });
  }, [fields]);

  // ----------------------------------------------------------------------------------------------------------
  // 単一のListを開く関数。(右側の下三角を押して編集。)
  const onClickListModify = async (index: number, event: React.MouseEvent) => {
    const singleListProps = {
      setLoading,
      event,
      getValues,
      index,
      listValues,
      listSetValue,
      onListOpen,
      userId,
    };
    getSingleListData(singleListProps);
  };

  // const onClickShoppingDatumModify = (event: React.MouseEvent) => {
  //   event.preventDefault();

  //   if (shoppingDatumValues) {
  //     shoppingDatumSetValue("modifyShoppingDate", shoppingDatumValues.shoppingDate);
  //     shoppingDatumSetValue("modifyEstimatedBudget", shoppingDatumValues.estimatedBudget);
  //     shoppingDatumSetValue("modifyShoppingMemo", shoppingDatumValues.shoppingMemo);
  //     shoppingDatumSetValue("modyfyShoppingDatumId", shoppingDatumValues.id);
  //     if (shopDataValue) {
  //       shoppingDatumSetValue("modifyShopName", shopDataValue.shopName);
  //       onShoppingDatumOpen();
  //     }
  //   }
  // };

  const watchCheckbox = fields.map((field, index) => ({
    checked: watch(`listForm.${index}.isBought`),
  }));

  const checkboxCount = watchCheckbox.filter((c) => c.checked === true).length;
  const calculateCheckbox = fields.length - checkboxCount;
  // ----------------------------------------------------------------------------------------------------------
  // 全体のリスト更新

  const onClickFinish = () => {
    const formData = getValues();
    onAllSubmit(formData);
    closeConfirm();
  };

  const props = { setLoading };
  const updateMemoListData = useUpdateUseMemoListOpenData(props);

  const onAllSubmit = (originFormData: MergeParams) => {
    if (calculateCheckbox === 0) {
      const formData = { ...originFormData, totalBudget };
      const updateMemoListProps = {
        formData,
        deleteIds,
        setDeleteIds,
        fields,
        append,
        setValue,
        userId,
      };

      updateMemoListData(updateMemoListProps);
    } else {
      showMessage({ title: "買い忘れ商品があります。チェックボックスにチェックを入れてください。", status: "warning" });
    }
  };
  // ----------------------------------------------------------------------------------------------------------

  const onClickBack = useCallback(() => history.push("/okaimono"), [history]);

  const onClickEndButton = () => {
    onConfirmOpen();
  };

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <>
      <form onSubmit={allListHandleSubmit(onAllSubmit)}>
        <Flex align="center" justify="center" px={3}>
          <VStack w="100rem">
            <Heading as="h2" size="lg" textAlign="center" pt={3}>
              今日のお買物メモ
            </Heading>
            <Divider my={4} />
            <OkaimonoMemoUseMemo
              // readOnly={readOnly}
              register={register}
              errors={errors}
              // onClickShoppingDatumModify={onClickShoppingDatumModify}
            />
            <OkaimonoMemoUseList
              fields={fields}
              register={register}
              getValues={getValues}
              // validationNumber={validationNumber}
              onClickListModify={onClickListModify}
              setDeleteIds={setDeleteIds}
              remove={remove}
              insertInputForm={insertInputForm}
              errors={errors}
            />
            <OkaimonoMemoUseCalculate
              totalBudget={totalBudget}
              shoppingBudgetField={shoppingBudgetField}
              calculateCheckbox={calculateCheckbox}
              onClickBack={onClickBack}
              userId={userId}
              onClickButton={onClickEndButton}
            />
            <Box h="15rem" />
          </VStack>
        </Flex>
      </form>

      <form onSubmit={shoppiingDatumModifyHandleSubmit(shoppingDatumSubmit)}>
        <OkaimonoMemoUseMemoModal
          isShoppingDatumOpen={isShoppingDatumOpen}
          closeShoppingDatum={closeShoppingDatum}
          readOnly={readOnly}
          shoppingDatumRegister={shoppingDatumRegister}
          shoppingDatumErrors={shoppingDatumErrors}
          validationNumber={validationNumber}
          onCloseShoppingDatum={onCloseShoppingDatum}
          shoppingDatumSubmit={shoppingDatumSubmit}
          shoppiingDatumModifyHandleSubmit={shoppiingDatumModifyHandleSubmit}
        />
      </form>

      <form onSubmit={oneListModifyHandleSubmit(onOneSubmit)}>
        <OkaimonoMemoUseListModal
          isListOpen={isListOpen}
          onCloseList={onCloseList}
          // readOnly={readOnly}
          listRegister={listRegister}
          // validationNumber={validationNumber}
          listErrors={listErrors}
          startDate={startDate}
          oneListModifyHandleSubmit={oneListModifyHandleSubmit}
          onOneSubmit={onOneSubmit}
        />
      </form>
      <Modal isOpen={isConfirmOpen} onClose={closeConfirm}>
        <ModalOverlay />
        <ModalContent maxW="95vw">
          <ModalHeader>お買い物を終了しますか？</ModalHeader>
          <ModalCloseButton _focus={{ outline: "none" }} />
          <ModalBody>終了を選択すると作成者以外はページを再表示することはできません。</ModalBody>
          <ModalFooter>
            <HStack>
              <PrimaryButton onClick={closeConfirm}>買い物を続ける</PrimaryButton>
              <Button bg="red.400" color="white" onClick={onClickFinish}>
                買い物を終了
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
