import { Box, Divider, Flex, Heading, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { appInfo } from "consts/appconst";
import { SignUpParams } from "interfaces";
import Cookies from "js-cookie";
import { signUp } from "lib/api/auth";
import React, { memo, useContext, useState, VFC } from "react";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";
import { useMessage } from "hooks/useToast";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { useForm } from "react-hook-form";

export const SignUp: VFC = memo(() => {
  console.log("サインアップが走っています");
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignUpParams>({ criteriaMode: "all", reValidateMode: "onSubmit" });

  // -------------------------------------------------------------------------------------------

  const onSubmit = async (formData: SignUpParams) => {
    const { name, email, password, passwordConfirmation } = formData;
    const params: SignUpParams = {
      name,
      email,
      password,
      passwordConfirmation,
    };

    console.log("SignUp.tsxが走っています");

    try {
      setLoading(true);
      const res = await signUp(params);
      console.log(res);
      const cookieData = {
        _access_token: res.headers["access-token"],
        _client: res.headers.client,
        _uid: res.headers.uid,
      };
      Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));

      console.log(document.cookie);
      setIsSignedIn(true);
      setCurrentUser(res?.data.data);
      history.push("/");
      const signUpMessage = `${res.data.message} ,ログインしました。`;
      showMessage({ title: signUpMessage, status: "success" });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        showMessage({
          title: `${err.response.data.errors.fullMessages}`,
          status: "error",
        });
        console.error(err.response);
      } else {
        showMessage({ title: "アカウントが作成できませんでした。", status: "error" });
      }
      setLoading(false);
    }
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
                  console.log(getValues("password"));
                  console.log(getValues("passwordConfirmation"));
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
            <PrimaryButtonForReactHookForm loading={loading}>アカウント作成</PrimaryButtonForReactHookForm>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
});
