import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import React, { memo, useContext, useState, VFC } from "react";
import { useHistory } from "react-router-dom";

import { appInfo } from "consts/appconst";
import { AuthContext } from "App";
import { useMessage } from "hooks/useToast";
import { SignInParams } from "interfaces";
import Cookies from "js-cookie";
import { signIn } from "lib/api/auth";
import { useForm } from "react-hook-form";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";

export const SignIn: VFC = memo(() => {
  console.log("サインインが走っています");
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { showMessage } = useMessage();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInParams>({ criteriaMode: "all", reValidateMode: "onSubmit" });

  const onSubmit = async (formData: SignInParams) => {
    const { email, password } = formData;
    const params: SignInParams = { email, password };

    console.log(params);
    try {
      setLoading(true);
      const res = await signIn(params);
      if (res?.status === 200) {
        console.log(res);
        const cookieData = {
          _access_token: res.headers["access-token"],
          _client: res.headers.client,
          _uid: res.headers.uid,
          _user_id: res.data.data.id,
        };
        Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));
        // console.log(document.cookie);
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        history.push("/");
        showMessage({ title: res.data.message, status: "success" });
      }
      // エラーハンドリング
    } catch (err: any) {
      console.log(err.response);
      if (err.response && err.response.data && err.response.data.errors) {
        showMessage({ title: `code:${err.response.status} ${err.response.data.errors}`, status: "error" });
      } else {
        showMessage({ title: "ログインできませんでした。", status: "error" });
      }
      setLoading(false);
    }
  };

  return loading ? (
    <Box h="50rem" display="flex" justifyContent="center" alignItems="center">
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
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="パスワード"
                aria-label="パスワード"
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
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" bg="teal.400" color="white" onClick={handleClick}>
                  {show ? "非表示" : "表示"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <>
                {errors.password?.types?.required && <Box color="red">{errors.password.types.required}</Box>}
                {errors.password?.types?.minLength && <Box color="red">{errors.password.types.minLength}</Box>}
                {errors.password?.types?.maxLength && <Box color="red">{errors.password.types.maxLength}</Box>}
              </>
            )}
            <Box />
            <PrimaryButtonForReactHookForm loading={loading}>ログイン</PrimaryButtonForReactHookForm>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
});
