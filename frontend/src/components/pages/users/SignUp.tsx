import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { appInfo } from "consts/appconst";
import { SignUpParams } from "interfaces";
import React, { memo, useState, VFC } from "react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { useForm } from "react-hook-form";
import { useAccountSignUp } from "hooks/useAccountSignUp";
import { TermsOfService } from "../TermsOfService";

export const SignUp: VFC = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const signUpAccount = useAccountSignUp(setLoading);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignUpParams>({ criteriaMode: "all", reValidateMode: "onSubmit" });

  // -------------------------------------------------------------------------------------------

  const onSubmit = async (formData: SignUpParams) => {
    signUpAccount(formData);
  };

  // const onClickTermOfService = () => history.push("/user/term_of_service");
  const onClickTermOfService = () => onOpen();
  const onChangeCheckBox = () => setCheck(!check);

  // -------------------------------------------------------------------------------------------

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Flex align="center" justify="center" height="90vh" px={3}>
      <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          {appInfo.Info.appName}
        </Heading>
        <Divider my={4} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text fontSize="xl" textAlign="center">
            アカウント登録
          </Text>
          <Stack spacing={3} py={4} px={10}>
            <Input
              placeholder="名前"
              aria-label="名前"
              {...register("name", {
                required: {
                  value: true,
                  message: "入力が必須の項目です。",
                },
                maxLength: {
                  value: 30,
                  message: "名前は30文字以内で入力してください。",
                },
              })}
            />
            {errors.name && (
              <>
                {errors.name.types?.maxLength && <Box color="red">{errors.name.types.maxLength}</Box>}
                {errors.name.types?.required && <Box color="red">{errors.name.types.required}</Box>}
              </>
            )}
            <Input
              placeholder="Eメールアドレス"
              aria-label="Eメールアドレス"
              {...register("email", {
                required: { value: true, message: "入力が必須の項目です。" },
                pattern: {
                  value: /[\w\-._]+@[\w\-._]+\.[A-Za-z]+/,
                  message: "有効なメールアドレスを入力してください。",
                },
                maxLength: {
                  value: 100,
                  message: "メールアドレスは100文字以内で入力してください。",
                },
              })}
            />
            {errors.email && (
              <>
                {errors.email.types?.pattern && <Box color="red">{errors.email.types.pattern}</Box>}
                {errors.email.types?.required && <Box color="red">{errors.email.types.required}</Box>}
              </>
            )}
            <Input
              placeholder="パスワード"
              aria-label="パスワード"
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "入力が必須の項目です。",
                },
                maxLength: {
                  value: 32,
                  message: "32文字以上のパスワードは設定できません。",
                },
                minLength: {
                  value: 8,
                  message: "8文字以上入力してください。",
                },
              })}
            />
            {errors.password && (
              <>
                {errors.password.types?.maxLength && <Box color="red">{errors.password.types.maxLength}</Box>}
                {errors.password.types?.required && <Box color="red">{errors.password.types.required}</Box>}
                {errors.password.types?.minLength && <Box color="red">{errors.password.types.minLength}</Box>}
              </>
            )}
            <Input
              placeholder="パスワード再入力"
              aria-label="パスワード再入力"
              type="password"
              {...register("passwordConfirmation", {
                required: {
                  value: true,
                  message: "入力が必須の項目です。",
                },
                validate: (value) => {
                  return value === getValues("password") || "メールアドレスが一致しません";
                },
              })}
            />
            {errors.passwordConfirmation && (
              <>
                {errors.passwordConfirmation.types?.validate && (
                  <Box color="red">{errors.passwordConfirmation.types.validate}</Box>
                )}
                {errors.passwordConfirmation.types?.required && (
                  <Box color="red">{errors.passwordConfirmation.types.required}</Box>
                )}
              </>
            )}
            <Box />
            <Checkbox size="md" colorScheme="green" onChange={onChangeCheckBox}>
              <HStack>
                <Text as="ins" onClick={onClickTermOfService}>
                  利用規約
                </Text>
                <Text>に同意します。</Text>
              </HStack>
            </Checkbox>
            <PrimaryButtonForReactHookForm loading={loading} disabled={!check}>
              アカウント作成
            </PrimaryButtonForReactHookForm>
          </Stack>
        </form>
      </Box>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TermsOfService />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                閉じる
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Flex>
  );
});
