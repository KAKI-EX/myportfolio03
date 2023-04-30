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
import React, { ChangeEvent, memo, useCallback, useContext, useState, VFC } from "react";
import { useHistory } from "react-router-dom";

import { PrimaryButton } from "components/atoms/PrimaryButton";
import { appInfo } from "consts/appconst";
import { SignInParams } from "interfaces";
import { signIn } from "lib/api/auth";
import Cookies from "js-cookie";
import { useMessage } from "hooks/useToast";
import { AuthContext } from "App";

export const SignIn: VFC = memo(() => {
  console.log("SignIn.tsx SignInが走っています。");
  const [userEmail, setUserEmail] = useState("");
  const history = useHistory();
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value);

  const [userPassword, setUserPassword] = useState("");
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // -------------------------------------------------------------------------------------------
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState<boolean>(false);
  const { showMessage } = useMessage();

  // ボタンを押すことにより発生する読み込みイベントをここで妨げている。
  const handleSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const params: SignInParams = {
        email: userEmail,
        password: userPassword,
      };

      console.log("SignIn.tsx SignInが走っています。");

      try {
        setLoading(true);
        const res = await signIn(params);
        if (res?.status === 200) {
          const addLoginFlag = { ...res, isLogin: "true" };
          const cookieData = {
            _access_token: res.headers["access-token"],
            _client: res.headers.client,
            _uid: res.headers.uid,
            _user_id: res.data.data.id,
            _isLogin: addLoginFlag.isLogin,
          };
          Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));

          console.log(document.cookie);
          setIsSignedIn(true);
          setCurrentUser(res?.data.data);
          setLoading(false);
          history.push("/");
          showMessage({ title: "ログインしました", status: "success" });
          // console.log(currentUser);
          // console.log(isSignIn);
        } else {
          showMessage({ title: "ログインできませんでした。", status: "" });
          setLoading(false);
        }
      } catch (err) {
        showMessage({ title: "ログインできませんでした。", status: "error" });
        console.log(err);
        setLoading(false);
      }
    },
    [history, setIsSignedIn, setCurrentUser, showMessage, onChangeEmail, onChangePassword, setLoading]
  );
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
          <PrimaryButton
            disabled={userEmail === "" || userPassword === ""}
            // loading={loading}
            onClick={handleSubmit}
            loading={loading}
          >
            ログイン
          </PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
