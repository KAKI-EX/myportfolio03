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
import React, { ChangeEvent, memo, useContext, useState, VFC } from "react";
import { useHistory } from "react-router-dom";

import { PrimaryButton } from "components/atoms/PrimaryButton";
import { appInfo } from "consts/appconst";
import { AuthContext } from "App";
import { useMessage } from "hooks/useToast";
import { SignInParams } from "interfaces";
import Cookies from "js-cookie";
import { signIn } from "lib/api/auth";

export const SignIn: VFC = memo(() => {
  console.log("サインインが走っています");
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [userEmail, setUserEmail] = useState("");
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value);

  const [userPassword, setUserPassword] = useState("");
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { showMessage } = useMessage();
  const history = useHistory();

  // -------------------------------------------------------------------------------------------
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const params: SignInParams = {
      email: userEmail,
      password: userPassword,
    };

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
        setLoading(false);
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
  // -------------------------------------------------------------------------------------------

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
        <Stack spacing={3} py={4} px={10}>
          <Input
            placeholder="Eメールアドレス"
            value={userEmail}
            onChange={onChangeEmail}
            aria-label="Eメールアドレス"
          />
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="パスワード"
              aria-label="パスワード"
              value={userPassword}
              onChange={onChangePassword}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" bg="teal.400" color="white" onClick={handleClick}>
                {show ? "非表示" : "表示"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Box />
          <PrimaryButton disabled={userEmail === "" || userPassword === ""} onClick={handleSubmit} loading={loading}>
            ログイン
          </PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
