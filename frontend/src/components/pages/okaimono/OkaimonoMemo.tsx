import { AddIcon, CloseIcon, SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  VStack,
  Show,
  Hide,
} from "@chakra-ui/react";
import { DeleteButton } from "components/atoms/DeleteButton";
import { PrimaryButton } from "components/atoms/PrimaryButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { OkaimonoParams } from "interfaces";
import { memo, useEffect, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";

export const OkaimonoMemo: VFC = memo(() => {
  const onSubmit = () => {
    alert("test");
  };

  const {
    register,
    handleSubmit,
    control, // 追加
  } = useForm<OkaimonoParams>();

  // 追加
  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  const insertInputForm = (index: number) => {
    insert(index + 1, { purchasename: "", price: "", shoppingmemo: "" });
    console.log(fields.length);
  };

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      // eslint-disable-line
      append({ purchasename: "", price: "", shoppingmemo: "" });
    }
  }, [append]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align="center" justify="center" px={3}>
        <VStack w="100rem">
          <Box>
            <Heading as="h2" size="lg" textAlign="center" pt={5}>
              お買い物メモの作成
            </Heading>
            <Divider my={4} />
            <Box>
              <Stack align="center" justify="center" py={6} spacing="3">
                <Box w="100%">
                  <Heading as="h3" size="sm" textAlign="center" px={7} pt={2}>
                    お買い物情報
                  </Heading>
                </Box>
                <Input
                  placeholder="Select Date and Time"
                  size="md"
                  type="date"
                  w="90%"
                  fontSize={{ base: "sm", md: "md" }}
                />
                <Input placeholder="お店の名前" size="md" w="90%" fontSize={{ base: "sm", md: "md" }} />
                <Input placeholder="一言メモ" size="md" w="90%" fontSize={{ base: "sm", md: "md" }} />
                <Divider my={4} />
              </Stack>
            </Box>
            <Box>
              <Heading as="h3" size="sm" textAlign="center" px={10} pt={5}>
                お買い物リスト
              </Heading>
              {fields.map((field, index) => (
                <HStack key={field.key} px={2} py={5} w="100%">
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
                        {...register(`listForm.${index}.purchasename`)}
                      />
                    </Box>
                    <Box w="100%">
                      <Input
                        placeholder="メモ"
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        {...register(`listForm.${index}.shoppingmemo`)}
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
                      {...register(`listForm.${index}.price`)}
                    />
                    <Box w="100%">
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                          ¥
                        </InputLeftElement>
                        <Input placeholder="希望金額" fontSize={{ base: "sm", md: "md" }} />
                      </InputGroup>
                    </Box>
                  </VStack>
                </HStack>
              ))}
            </Box>
          </Box>
          <Stack w="80%" py="5%">
            <PrimaryButtonForReactHookForm>お買い物リストを確定</PrimaryButtonForReactHookForm>
            <DeleteButton>保存しない</DeleteButton>
          </Stack>
        </VStack>
      </Flex>
    </form>
  );
});
