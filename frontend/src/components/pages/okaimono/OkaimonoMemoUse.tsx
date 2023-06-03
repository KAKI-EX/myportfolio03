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

export const OkaimonoMemoUse: VFC = memo(() => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listValues, setListValues] = useState<OkaimonoMemosData[]>();
  const [shoppingDatumValues, setShoppingDatumValues] = useState<OkaimonoMemoDataShow>();
  const [shopDataValue, setShopDataValues] = useState<OkaimonoShopModifingData>();

  const { isOpen: isShoppingDatumOpen, onOpen: onShoppingDatumOpen, onClose: onCloseShoppingDatum } = useDisclosure();
  const { isOpen: isListOpen, onOpen: onListOpen, onClose: onCloseList } = useDisclosure();

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
      shopping_date: formattedDefaultShoppingDate,
      listForm: [{ price: "", id: "", amount: "", purchase_name: "", asc: "" }],
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

  const startDate = listWatch(`modify_expiry_date_start`);
  // ----------------------------------------------------------------------------------------------------------

  // ReactHookFormの機能呼び出し、デフォルト値の設定。
  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  // ----------------------------------------------------------------------------------------------------------

  const shoppingBudgetField = watch("estimated_budget");
  const watchedPriceFields = fields.map((field, index) => ({
    price: watch(`listForm.${index}.price`),
    amount: watch(`listForm.${index}.amount`),
  }));

  const totalBudget = watchedPriceFields.reduce(
    (acc, { price, amount }) => acc + Number(price || "") * Number(amount || "1"),
    0
  );

  const shoppingDatumSubmit = (shoppingDatumFormData: any) => {
    setReadOnly(!readOnly);
    console.log("これやねん", shoppingDatumFormData);
  };

  const onOneSubmit = () => {
    setReadOnly(!readOnly);
  };

  const onAllSubmit = () => {
    alert("tst");
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
    const setShoppingMemoList = async () => {
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
            setValue("shopping_date", shoppingDatumRes.data.shoppingDate);
            setValue("shopping_datum_id", id);
            setValue("estimated_budget", shoppingDatumRes.data.estimatedBudget);

            const shopProps = {
              userId,
              shopId: shoppingDatumRes.data.shopId,
            };
            const shopRes = await shopShow(shopProps);
            if (shopRes.status === 200) {
              setShopDataValues(shopRes.data);
              setValue("shop_name", shopRes.data.shopName);
              const listProps = {
                userId,
                shoppingDataId: id,
              };
              const shoppingListRes: OkaimonoMemosDataResponse = await memosShow(listProps);
              if (shopRes.status === 200) {
                setListValues(shoppingListRes.data);
                for (let i = fields.length; i < shoppingListRes.data.length; i++) {
                  append({ purchase_name: "", price: "", shopping_detail_memo: "", amount: "", id: "", asc: "" });
                }
                shoppingListRes.data.forEach((list, index) => {
                  setValue(`listForm.${index}.price`, list.price);
                  setValue(`listForm.${index}.amount`, list.amount);
                  setValue(`listForm.${index}.purchase_name`, list.purchaseName);
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
    setShoppingMemoList();
  }, []);

  const onClickListModify = (index: number) => (event: React.MouseEvent) => {
    if (listValues) {
      listSetValue("modify_purchase_name", listValues[index].purchaseName);
      listSetValue("modify_amount", listValues[index].amount);
      listSetValue("modify_memo", listValues[index].shoppingDetailMemo);
      listSetValue("modify_expiry_date_start", listValues[index].expiryDateStart);
      listSetValue("modify_expiry_date_end", listValues[index].expiryDateEnd);
      onListOpen();
    }
  };

  const onClickShoppingDatumModify = () => (event: React.MouseEvent) => {
    if (shoppingDatumValues) {
      shoppingDatumSetValue("modify_shopping_date", shoppingDatumValues.shoppingDate);
      shoppingDatumSetValue("modify_estimated_budget", shoppingDatumValues.estimatedBudget);
      shoppingDatumSetValue("modify_shopping_memo", shoppingDatumValues.shoppingMemo);
      shoppingDatumSetValue("modify_shopping_datum_id", shoppingDatumValues.id);
      if (shopDataValue) {
        shoppingDatumSetValue("modifiy_shop_name", shopDataValue.shopName);
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
                    {...register("shopping_date")}
                  />
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={readOnly ? "お店の名前" : ""}
                    size="md"
                    w="100%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...register("shop_name", {
                      maxLength: { value: 35, message: "最大文字数は35文字までです。" },
                    })}
                  />
                  {errors.shop_name && errors.shop_name.types?.maxLength && (
                    <Box color="red">{errors.shop_name.types.maxLength}</Box>
                  )}
                  <InputGroup w="100%">
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      size="md"
                      placeholder={!readOnly ? "お買い物の予算" : ""}
                      type="number"
                      fontSize={{ base: "sm", md: "md" }}
                      {...register("estimated_budget")}
                    />
                    <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                      円
                    </InputRightElement>
                  </InputGroup>
                  <Input type="hidden" {...register(`shopping_datum_id`)} />
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
                    <Checkbox size="lg" colorScheme="green" ml={1} />
                    <Input
                      border="none"
                      w="53%"
                      px={1}
                      ml={0}
                      readOnly
                      {...register(`listForm.${index}.purchase_name`)}
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
                  現在の合計(税別): {totalBudget}円 {/* eslint-disable-line */}
                </Box>
                {/* eslint-disable-next-line */}
                <Box as="p" color={Number(shoppingBudgetField || "") < totalBudget ? "red.500" : "white"}>
                  {/* eslint-disable-next-line */}
                  お買い物予算残り: {Number(shoppingBudgetField || "") - totalBudget}円
                </Box>
              </Box>
              <Stack w="80%" py="3%">
                <PrimaryButtonForReactHookForm disabled={!isValid}>
                  {readOnly ? "編集する" : "保存する"}
                </PrimaryButtonForReactHookForm>
                <DeleteButton onClick={onClickBack}>一覧に戻る</DeleteButton>
              </Stack>
            </VStack>
          </VStack>
        </Flex>
      </form>

      <form onSubmit={shoppiingDatumModifyHandleSubmit(shoppingDatumSubmit)}>
        <Modal isOpen={isShoppingDatumOpen} onClose={onCloseShoppingDatum}>
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
                    {...shoppingDatumRegister("modify_shopping_date")}
                  />
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "お店の名前" : ""}
                    size="md"
                    w="90%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...shoppingDatumRegister("modifiy_shop_name", {
                      maxLength: { value: 35, message: "最大文字数は35文字までです。" },
                    })}
                  />
                  {shoppingDatumErrors.modifiy_shop_name && shoppingDatumErrors.modifiy_shop_name.types?.maxLength && (
                    <Box color="red">{shoppingDatumErrors.modifiy_shop_name.types.maxLength}</Box>
                  )}
                  <InputGroup w="90%">
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      size="md"
                      placeholder={!readOnly ? "お買い物の予算" : ""}
                      // type="number"
                      fontSize={{ base: "sm", md: "md" }}
                      {...shoppingDatumRegister("modify_estimated_budget", {
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
                  {shoppingDatumErrors.modify_estimated_budget &&
                    shoppingDatumErrors.modify_estimated_budget.types?.pattern && (
                      <Box color="red">{shoppingDatumErrors.modify_estimated_budget.types.pattern}</Box>
                    )}
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "一言メモ" : ""}
                    size="md"
                    w="90%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...shoppingDatumRegister("modify_shopping_memo", {
                      maxLength: { value: 150, message: "最大文字数は150文字です。" },
                    })}
                  />
                  {shoppingDatumErrors.modify_shopping_memo && shoppingDatumErrors.modify_shopping_memo.types?.maxLength && (
                    <Box color="red">{shoppingDatumErrors.modify_shopping_memo.types.maxLength}</Box>
                  )}
                  <Input type="hidden" {...shoppingDatumRegister(`modify_shopping_datum_id`)} />
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
                        {...listRegister(`modify_purchase_name`, {
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
                          {...listRegister(`modify_amount`, {
                            max: { value: 99, message: "上限は99までです。" },
                            pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                          })}
                        />
                        <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                          個
                        </InputRightElement>
                      </InputGroup>
                    </HStack>
                    {listErrors.modify_purchase_name && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modify_purchase_name?.types?.required}
                        {listErrors.modify_purchase_name?.types?.maxLength}
                      </Box>
                    )}
                    {listErrors.modify_amount && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modify_amount?.types?.max}
                        {listErrors.modify_amount?.types?.pattern}
                      </Box>
                    )}
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      placeholder="メモ"
                      fontSize={{ base: "sm", md: "md" }}
                      {...listRegister(`modify_memo`, {
                        maxLength: { value: 150, message: "最大文字数は150文字です。" },
                      })}
                    />
                    {listErrors.modify_memo && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modify_memo?.types?.maxLength}
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
                      {...listRegister(`modify_expiry_date_start`)}
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
                      {...listRegister(`modify_expiry_date_end`, {
                        validate: (value) =>
                          !startDate || // eslint-disable-line
                          !value ||
                          new Date(value) >= new Date(startDate) ||
                          "終了日は開始日以降の日付を選択してください。",
                      })}
                    />
                  </Box>
                </HStack>
                {listErrors.modify_expiry_date_end && (
                  <Box color="red" fontSize="sm">
                    {listErrors.modify_expiry_date_end?.message}
                  </Box>
                )}
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
