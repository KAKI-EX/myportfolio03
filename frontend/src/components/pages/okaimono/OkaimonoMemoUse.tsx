import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import {
  ListFormParams,
  MergeParams,
  OkaimonoMemoDataShow,
  OkaimonoMemoDataShowResponse,
  OkaimonoMemosData,
  OkaimonoMemosDataResponse,
  OkaimonoShopModifingData,
} from "interfaces";
import React, { memo, useEffect, useState, VFC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ja } from "date-fns/locale";
import { ChevronDownIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { DeleteButton } from "components/atoms/DeleteButton";
import { useParams } from "react-router-dom";
import { memosShow, shoppingDatumShow, shopShow } from "lib/api/show";
import { useCookie } from "hooks/useCookie";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import { shopCreate } from "lib/api/post";
import { memosUpdate, shoppingDatumUpdate } from "lib/api/update";

export const OkaimonoMemoUse: VFC = memo(() => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listValues, setListValues] = useState<OkaimonoMemosData[]>();
  const [shoppingDatumValues, setShoppingDatumValues] = useState<OkaimonoMemoDataShow>();
  const [shopDataValue, setShopDataValues] = useState<OkaimonoShopModifingData>();

  const { isOpen: isShoppingDatumOpen, onOpen: onShoppingDatumOpen, onClose: closeShoppingDatum } = useDisclosure();
  const { isOpen: isListOpen, onOpen: onListOpen, onClose: closeList } = useDisclosure();

  const defaultShoppingDate = new Date();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });
  const validationNumber = /^[0-9]+$/;

  const { id } = useParams<{ id: string }>();

  // ----------------------------------------------------------------------------------------------------------
  // okaimono_memo_useのランディングページ用useForm呼び出し
  const {
    setValue,
    register,
    control,
    watch,
    handleSubmit: allListHandleSubmit,
    formState: { errors, isValid },
  } = useForm<MergeParams>({
    defaultValues: {
      shoppingDate: formattedDefaultShoppingDate,
      listForm: [{ price: "", id: "", amount: "", purchaseName: "", asc: "", checkbox: "", }],
    },
    criteriaMode: "all",
    mode: "all",
  });

  // ----------------------------------------------------------------------------------------------------------
  // shoppingDatum-編集用のuseForm呼び出し
  const {
    setValue: shoppingDatumSetValue,
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
  const shoppingDatumSubmit = async (shoppingDatumFormData: MergeParams) => {
    setReadOnly(!readOnly);
    if (!readOnly) {
      setLoading(true);
      const userId = separateCookies("_user_id");
      const { modifyShopName, modifyShoppingDate, modifyShoppingMemo, modifyEstimatedBudget, modyfyShoppingDatumId } =
        shoppingDatumFormData;
      const shopParams: MergeParams = { userId, shopName: modifyShopName || "お店名称未設定でのお買い物" };
      try {
        const shopUpdateRes = await shopCreate(shopParams);
        if (shopUpdateRes.status === 200) {
          const shopId = shopUpdateRes.data.id;
          const shoppingDataParams: MergeParams = {
            userId,
            shopId,
            shoppingDate: modifyShoppingDate,
            shoppingMemo: modifyShoppingMemo,
            estimatedBudget: modifyEstimatedBudget,
            shoppingDatumId: modyfyShoppingDatumId,
          };
          await shoppingDatumUpdate(shoppingDataParams);
          setLoading(false);
          showMessage({ title: `お買い物メモの修正が完了しました。`, status: "success" });
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        setLoading(false);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    }
  };

  const onCloseShoppingDatum = () => {
    getShoppingMemoList();
    setReadOnly(true);
    closeShoppingDatum();
  };
  // ----------------------------------------------------------------------------------------------------------
  // リスト情報の単一修正論理式。(右の下矢印から編集を選び、編集する際に呼び出される論理式。)
  const onOneSubmit = async (oneListFormData: MergeParams) => {
    setReadOnly(!readOnly);
    if (!readOnly) {
      setLoading(true);
      const userId = separateCookies("_user_id");
      try {
        const listParams: ListFormParams = {
          memoId: oneListFormData.modifyId,
          userId,
          shoppingDatumId: oneListFormData.modifyListShoppingDatumId,
          shopId: oneListFormData.modifyShopId,
          purchaseName: oneListFormData.modifyPurchaseName,
          shoppingDetailMemo: oneListFormData.modifyMemo,
          amount: oneListFormData.modifyAmount,
          shoppingDate: oneListFormData.modifyListShoppingDate,
          asc: oneListFormData.modifyAsc,
          expiryDateStart: oneListFormData.modifyExpiryDateStart,
          expiryDateEnd: oneListFormData.modifyExpiryDateEnd,
        };
        const memosUpdateRes = await memosUpdate([listParams]);
        setLoading(false);
        showMessage({ title: `お買い物リストの修正が完了しました。`, status: "success" });
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        setLoading(false);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    }
  };

  const onCloseList = () => {
    getShoppingMemoList();
    setReadOnly(true);
    closeList();
  };
  // ----------------------------------------------------------------------------------------------------------

  const onAllSubmit = (listFormData: any) => {
    console.log("aaaeeaaaeeeasdfa", listFormData);
  };

  const addNewList = () => {
    alert("tst");
  };

  const onClickBack = () => {
    alert("test");
  };

  const { showMessage } = useMessage();
  const { separateCookies } = useCookie();

  useEffect(() => {
    getShoppingMemoList();
  }, []);

  const getShoppingMemoList = async () => {
    setLoading(true);
    const userId = separateCookies("_user_id");
    if (userId) {
      const memosProps = {
        userId,
        shoppingDataId: id,
      };
      try {
        const shoppingDatumRes = await shoppingDatumShow(memosProps);
        if (shoppingDatumRes?.status === 200) {
          setShoppingDatumValues(shoppingDatumRes.data);
          setValue("shoppingDate", shoppingDatumRes.data.shoppingDate);
          setValue("shoppingDatumId", id);
          setValue("estimatedBudget", shoppingDatumRes.data.estimatedBudget);

          const shopProps = {
            userId,
            shopId: shoppingDatumRes.data.shopId,
          };
          const shopRes = await shopShow(shopProps);
          if (shopRes.status === 200) {
            setShopDataValues(shopRes.data);
            setValue("shopName", shopRes.data.shopName);
            const listProps = {
              userId,
              shoppingDataId: id,
            };
            const shoppingListRes: OkaimonoMemosDataResponse = await memosShow(listProps);
            if (shopRes.status === 200) {
              setListValues(shoppingListRes.data);
              for (let i = fields.length; i < shoppingListRes.data.length; i++) {
                append({ purchaseName: "", price: "", shoppingDetailMemo: "", amount: "", id: "", asc: "" });
              }
              shoppingListRes.data.forEach((list, index) => {
                setValue(`listForm.${index}.price`, list.price);
                setValue(`listForm.${index}.amount`, list.amount);
                setValue(`listForm.${index}.purchaseName`, list.purchaseName);
                setValue(`listForm.${index}.amount`, list.amount);
                setValue(`listForm.${index}.id`, list.id);
                setValue(`listForm.${index}.asc`, list.asc);
              });
            }
          }
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    }
  };

  const onClickListModify = (index: number) => (event: React.MouseEvent) => {
    if (listValues) {
      listSetValue("modifyPurchaseName", listValues[index].purchaseName);
      listSetValue("modifyAmount", listValues[index].amount);
      listSetValue("modifyMemo", listValues[index].shoppingDetailMemo);
      listSetValue("modifyExpiryDateStart", listValues[index].expiryDateStart);
      listSetValue("modifyExpiryDateEnd", listValues[index].expiryDateEnd);
      listSetValue("modifyId", listValues[index].id);
      listSetValue("modifyAsc", listValues[index].asc);
      listSetValue("modifyShopId", listValues[index].shopId);
      listSetValue("modifyListShoppingDate", listValues[index].shoppingDate);
      listSetValue("modifyListShoppingDatumId", listValues[index].shoppingDatumId);
      onListOpen();
    }
  };

  const onClickShoppingDatumModify = () => (event: React.MouseEvent) => {
    if (shoppingDatumValues) {
      shoppingDatumSetValue("modifyShoppingDate", shoppingDatumValues.shoppingDate);
      shoppingDatumSetValue("modifyEstimatedBudget", shoppingDatumValues.estimatedBudget);
      shoppingDatumSetValue("modifyShoppingMemo", shoppingDatumValues.shoppingMemo);
      shoppingDatumSetValue("modyfyShoppingDatumId", shoppingDatumValues.id);
      if (shopDataValue) {
        shoppingDatumSetValue("modifyShopName", shopDataValue.shopName);
        onShoppingDatumOpen();
      }
    }
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
            <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
              お買い物情報
            </Heading>
            <Box bg="white" rounded="xl" w="100%" boxShadow="md">
              <HStack>
                <Stack align="center" justify="center" py={6} spacing="3" w="95%" ml={5}>
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    size="md"
                    type="date"
                    w="100%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...register("shoppingDate")}
                  />
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={readOnly ? "お店の名前" : ""}
                    size="md"
                    w="100%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...register("shopName", {
                      maxLength: { value: 35, message: "最大文字数は35文字までです。" },
                    })}
                  />
                  {errors.shopName && errors.shopName.types?.maxLength && (
                    <Box color="red">{errors.shopName.types.maxLength}</Box>
                  )}
                  <InputGroup w="100%">
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      size="md"
                      placeholder={!readOnly ? "お買い物の予算" : ""}
                      type="number"
                      fontSize={{ base: "sm", md: "md" }}
                      {...register("estimatedBudget")}
                    />
                    <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                      円
                    </InputRightElement>
                  </InputGroup>
                  <Input type="hidden" {...register(`shoppingDatumId`)} />
                </Stack>
                <Box w="5%">
                  <Menu>
                    <MenuButton as={ChevronDownIcon} />
                    <MenuList borderRadius="md" shadow="md">
                      <MenuItem onClick={onClickShoppingDatumModify()}>確認&編集</MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              </HStack>
            </Box>
            {fields.map((field, index) => {
              return (
                <Box w="100%" key={field.key}>
                  <HStack bg="white" py={4} px={2} rounded={10} boxShadow="md">
                    <Checkbox
                      size="lg"
                      colorScheme="green"
                      ml={1}
                      {...register(`listForm.${index}.checkbox`)}
                    />
                    <Input
                      border="none"
                      w="53%"
                      px={1}
                      ml={0}
                      readOnly
                      {...register(`listForm.${index}.purchaseName`)}
                    />
                    <InputGroup w="17%">
                      <Input
                        textAlign="center"
                        px={1}
                        border="none"
                        readOnly
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        type="number"
                        min="1"
                        {...register(`listForm.${index}.amount`, {
                          max: { value: 99, message: "上限は99までです。" },
                          pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                        })}
                      />
                      <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                        個
                      </InputRightElement>
                    </InputGroup>
                    {errors.listForm && errors.listForm[index]?.amount && (
                      <Box color="red" fontSize="sm">
                        {errors.listForm[index]?.amount?.types?.max}
                        {errors.listForm[index]?.amount?.types?.pattern}
                      </Box>
                    )}
                    <InputGroup w="30%">
                      <Input
                        placeholder="いくら？"
                        type="number"
                        fontSize={{ base: "sm", md: "md" }}
                        {...register(`listForm.${index}.price`, {
                          pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                        })}
                      />
                      <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                        円
                      </InputRightElement>
                    </InputGroup>
                    {errors.listForm && errors.listForm[index]?.price && (
                      <Box color="red" fontSize="sm">
                        {errors.listForm[index]?.price?.types?.pattern}
                      </Box>
                    )}
                    <Input type="hidden" {...register(`listForm.${index}.id`)} />
                    <Input type="hidden" {...register(`listForm.${index}.asc`)} />
                    <Menu>
                      <MenuButton as={ChevronDownIcon} />
                      <MenuList borderRadius="md" shadow="md">
                        <MenuItem onClick={onClickListModify(index)}>編集する</MenuItem>
                        <MenuItem>削除する</MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Box>
              );
            })}
            <Icon as={PlusSquareIcon} boxSize={5} style={{ transform: "translateY(20px)" }} onClick={addNewList} />
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
                  現在の合計(税別): {totalBudget}円
                </Box>

                <Box as="p" color={Number(shoppingBudgetField || "") < totalBudget ? "red.500" : "white"}>
                  お買い物予算残り: {Number(shoppingBudgetField || "") - totalBudget}円
                </Box>
              </Box>
              <Stack w="80%" py="3%">
                <PrimaryButtonForReactHookForm disabled={!isValid} onClick={onAllSubmit}>
                  保存する
                </PrimaryButtonForReactHookForm>
                <DeleteButton onClick={onClickBack}>一覧に戻る</DeleteButton>
              </Stack>
            </VStack>
          </VStack>
        </Flex>
      </form>

      <form onSubmit={shoppiingDatumModifyHandleSubmit(shoppingDatumSubmit)}>
        <Modal isOpen={isShoppingDatumOpen} onClose={closeShoppingDatum}>
          <ModalOverlay />
          <ModalContent bg="gray.100" maxW="95vw">
            <ModalHeader>選択したお買い物メモ情報</ModalHeader>
            <ModalCloseButton _focus={{ boxShadow: "none" }} />
            <ModalBody>
              <Box bg="white" rounded="xl">
                <Stack align="center" justify="center" py={6} spacing="3">
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    size="md"
                    type="date"
                    w="90%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...shoppingDatumRegister("modifyShoppingDate")}
                  />
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "お店の名前" : ""}
                    size="md"
                    w="90%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...shoppingDatumRegister("modifyShopName", {
                      maxLength: { value: 35, message: "最大文字数は35文字までです。" },
                    })}
                  />
                  {shoppingDatumErrors.modifyShopName && shoppingDatumErrors.modifyShopName.types?.maxLength && (
                    <Box color="red">{shoppingDatumErrors.modifyShopName.types.maxLength}</Box>
                  )}
                  <InputGroup w="90%">
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      size="md"
                      placeholder={!readOnly ? "お買い物の予算" : ""}
                      type="number"
                      fontSize={{ base: "sm", md: "md" }}
                      {...shoppingDatumRegister("modifyEstimatedBudget", {
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
                  {shoppingDatumErrors.modifyEstimatedBudget &&
                    shoppingDatumErrors.modifyEstimatedBudget.types?.pattern && (
                      <Box color="red">{shoppingDatumErrors.modifyEstimatedBudget.types.pattern}</Box>
                    )}
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "一言メモ" : ""}
                    size="md"
                    w="90%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...shoppingDatumRegister("modifyShoppingMemo", {
                      maxLength: { value: 150, message: "最大文字数は150文字です。" },
                    })}
                  />
                  {shoppingDatumErrors.modifyShoppingMemo &&
                    shoppingDatumErrors.modifyShoppingMemo.types?.maxLength && (
                      <Box color="red">{shoppingDatumErrors.modifyShoppingMemo.types.maxLength}</Box>
                    )}
                  <Input type="hidden" {...shoppingDatumRegister(`modyfyShoppingDatumId`)} />
                </Stack>
              </Box>
            </ModalBody>
            <ModalFooter>
              <HStack>
                <Button bg="gray.400" color="white" mr={3} onClick={onCloseShoppingDatum}>
                  閉じる
                </Button>
                <PrimaryButtonForReactHookForm onClick={shoppiingDatumModifyHandleSubmit(shoppingDatumSubmit)}>
                  {readOnly ? "編集" : "保存"}{" "}
                </PrimaryButtonForReactHookForm>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </form>

      <form onSubmit={oneListModifyHandleSubmit(onOneSubmit)}>
        <Modal isOpen={isListOpen} onClose={onCloseList}>
          <ModalOverlay />
          <ModalContent bg="gray.100" maxW="95vw">
            <ModalHeader>選択したリストの情報</ModalHeader>
            <ModalCloseButton _focus={{ boxShadow: "none" }} />
            <ModalBody>
              <VStack w="100%">
                <Box bg="white" p={3} rounded="md">
                  <VStack>
                    <HStack>
                      <Input
                        isReadOnly={readOnly}
                        bg={readOnly ? "blackAlpha.200" : "white"}
                        placeholder="商品名"
                        w="70%"
                        fontSize={{ base: "sm", md: "md" }}
                        {...listRegister(`modifyPurchaseName`, {
                          required: { value: true, message: "商品名が入力されていません" },
                          maxLength: { value: 30, message: "最大文字数は30文字までです。" },
                        })}
                      />
                      <InputGroup w="30%">
                        <Input
                          isReadOnly={readOnly}
                          bg={readOnly ? "blackAlpha.200" : "white"}
                          placeholder="個数"
                          type="number"
                          fontSize={{ base: "sm", md: "md" }}
                          {...listRegister(`modifyAmount`, {
                            max: { value: 99, message: "上限は99までです。" },
                            pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                          })}
                        />
                        <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                          個
                        </InputRightElement>
                      </InputGroup>
                    </HStack>
                    {listErrors.modifyPurchaseName && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modifyPurchaseName?.types?.required}
                        {listErrors.modifyPurchaseName?.types?.maxLength}
                      </Box>
                    )}
                    {listErrors.modifyAmount && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modifyAmount?.types?.max}
                        {listErrors.modifyAmount?.types?.pattern}
                      </Box>
                    )}
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      placeholder="メモ"
                      fontSize={{ base: "sm", md: "md" }}
                      {...listRegister(`modifyMemo`, {
                        maxLength: { value: 150, message: "最大文字数は150文字です。" },
                      })}
                    />
                    {listErrors.modifyMemo && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modifyMemo?.types?.maxLength}
                      </Box>
                    )}
                  </VStack>
                </Box>
                <HStack w="100%" bg="white" p={3} rounded="md">
                  <Box w="50%">
                    <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
                      消費期限 開始日
                    </FormLabel>
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      type="date"
                      placeholder="消費期限 開始"
                      {...listRegister(`modifyExpiryDateStart`)}
                    />
                  </Box>
                  <Box w="50%">
                    <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
                      終了日
                    </FormLabel>
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      type="date"
                      placeholder="終了日"
                      {...listRegister(`modifyExpiryDateEnd`, {
                        validate: (value) =>
                          !startDate ||
                          !value ||
                          new Date(value) >= new Date(startDate) ||
                          "終了日は開始日以降の日付を選択してください。",
                      })}
                    />
                  </Box>
                </HStack>
                {listErrors.modifyExpiryDateEnd && (
                  <Box color="red" fontSize="sm">
                    {listErrors.modifyExpiryDateEnd?.message}
                  </Box>
                )}
                <Input type="hidden" {...register(`modifyId`)} />
                <Input type="hidden" {...register(`modifyAsc`)} />
                <Input type="hidden" {...register(`modifyShopId`)} />
                <Input type="hidden" {...register(`modifyListShoppingDatumId`)} />
                <Input type="hidden" {...register(`modifyListShoppingDate`)} />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack>
                <Button bg="gray.400" color="white" mr={3} onClick={onCloseList}>
                  閉じる
                </Button>
                <PrimaryButtonForReactHookForm onClick={oneListModifyHandleSubmit(onOneSubmit)}>
                  {readOnly ? "編集" : "保存"}{" "}
                </PrimaryButtonForReactHookForm>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </form>
    </>
  );
});
