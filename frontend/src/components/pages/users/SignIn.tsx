import { Box, Divider, Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import React, { memo, useCallback, useState, VFC } from "react";

import { appInfo } from "consts/appconst";
import { UserInputParams } from "interfaces";
import { useForm } from "react-hook-form";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { useAccountSignIn } from "hooks/useAccountSignIn";
import { InputEmailAddress } from "components/atoms/InputEmailAddress";
import { InputEmailAddressErrors } from "components/atoms/InputEmailAddressErrors";
import { InputPasswordWithButton } from "components/atoms/InputPasswordWithButton";
import { InputPasswordWithButtonErrors } from "components/atoms/InputPasswordWithButtonErrors";

export const SignIn: VFC = memo(() => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const accountSignIn = useAccountSignIn(setLoading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInputParams>({ criteriaMode: "all", reValidateMode: "onSubmit" });

  const onSubmit = useCallback(
    async (formData: UserInputParams) => {
      accountSignIn(formData);
    },
    [accountSignIn]
  );

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
          <Stack spacing={3} py={4} px={10}>
            <InputEmailAddress register={register} placeholder="Emailアドレス" />
            <InputEmailAddressErrors errors={errors} />
            <InputPasswordWithButton show={show} register={register} handleClick={handleClick} />
            <InputPasswordWithButtonErrors errors={errors} />
            <PrimaryButtonForReactHookForm loading={loading}>ログイン</PrimaryButtonForReactHookForm>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
});
