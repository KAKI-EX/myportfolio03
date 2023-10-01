import { Box, Divider, Flex, Heading, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { appInfo } from "consts/appconst";
import { UserInputParams } from "interfaces";
import React, { memo, useEffect, useState, VFC } from "react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccountUpdate } from "hooks/useAccountUpdate";
import { useAccountConfirmation } from "hooks/useAccountConfirmation";
import { InputEmailAddress } from "components/atoms/InputEmailAddress";
import { InputEmailAddressErrors } from "components/atoms/InputEmailAddressErrors";
import { InputPasswordWithoutButton } from "components/atoms/InputPasswordWithoutButton";
import { InputPasswordWithButtonErrors } from "components/atoms/InputPasswordWithButtonErrors";
import { InputPasswordConfirmationWithoutButton } from "components/atoms/InputPasswordConfirmationWithoutButton";
import { InputPasswordConfirmationWithoutButtonErrors } from "components/atoms/InputPasswordConfirmationWithoutButtonErrors";
import { InputNickName } from "components/atoms/InputNickName";

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
  } = useForm<UserInputParams>({ criteriaMode: "all", reValidateMode: "onSubmit" });

  const acsProps = {
    setValue,
    setLoading,
  };
  const accountConfirmationSetting = useAccountConfirmation(acsProps);
  useEffect(() => {
    accountConfirmationSetting();
  }, []);

  const onSubmit: SubmitHandler<UserInputParams> = async (data: UserInputParams) => {
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
            <InputNickName register={register} />
            <InputEmailAddress register={register} placeholder="変更するEメールアドレス" />
            <InputEmailAddressErrors errors={errors} />
            <InputPasswordWithoutButton register={register} placeholder="変更するパスワード" />
            <InputPasswordWithButtonErrors errors={errors} />
            <InputPasswordConfirmationWithoutButton register={register} getValues={getValues} />
            <InputPasswordConfirmationWithoutButtonErrors errors={errors} />
            <Box />
            <PrimaryButtonForReactHookForm loading={loading}>アカウント更新</PrimaryButtonForReactHookForm>
            <Text fontSize={textFontSize}>変更が無い場合もEメールアドレスとパスワードは必ず入力してください。</Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
});
