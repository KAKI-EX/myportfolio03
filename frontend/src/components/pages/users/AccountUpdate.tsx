import { Box, Divider, Flex, Heading, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { appInfo } from "consts/appconst";
import { SignUpParams } from "interfaces";
import React, { memo, useEffect, useState, VFC } from "react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccountUpdate } from "hooks/useAccountUpdate";
import { useAccountConfirmation } from "hooks/useAccountConfirmation";

export const AccountUpdate: VFC = memo(() => {
  const textFontSize = ["sm", "md", "md", "xl"];
  const [loading, setLoading] = useState(false);
  const updateAccount = useAccountUpdate(setLoading);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SignUpParams>({ criteriaMode: "all", reValidateMode: "onSubmit" });

  const acsProps = {
    setValue,
    setLoading,
  };
  const accountConfirmationSetting = useAccountConfirmation(acsProps);
  useEffect(() => {
    accountConfirmationSetting();
  }, []);

  const onSubmit: SubmitHandler<SignUpParams> = async (data: SignUpParams) => {
    updateAccount(data);
  };

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
            アカウント情報の更新
          </Text>
          <Stack spacing={3} py={4} px={10}>
            <Input placeholder="変更する名前" aria-label="名前" {...register("name")} />
            <Input
              placeholder="変更するEメールアドレス"
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
              placeholder="変更するパスワード"
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
            <PrimaryButtonForReactHookForm loading={loading}>アカウント更新</PrimaryButtonForReactHookForm>
            <Text fontSize={textFontSize}>変更が無い場合もEメールアドレスとパスワードは必ず入力してください。</Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
});
