import { Box, Divider, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { PrimaryButton } from "components/atoms/PrimaryButton";
import { appInfo } from "consts/appconst";
import { SignUpParams } from "interfaces";
import Cookies from "js-cookie";
import { signUp } from "lib/api/auth";
import React, { ChangeEvent, memo, useContext, useState, VFC } from "react";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";
import { useMessage } from "hooks/useToast";

export const AccountUpdate: VFC = memo(() => {
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [userName, setUserName] = useState("");
  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);

  const [userEmail, setUserEmail] = useState("");
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value);

  const [userPassword, setUserPassword] = useState("");
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value);

  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("");
  const onClickPasswordConfirmation = (e: ChangeEvent<HTMLInputElement>) => setUserPasswordConfirmation(e.target.value);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();
  // -------------------------------------------------------------------------------------------

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const params: SignUpParams = {
      name: userName,
      email: userEmail,
      password: userPassword,
      passwordConfirmation: userPasswordConfirmation,
    };

    try {
      setLoading(true);
      const res = await signUp(params);
      const cookieData = {
        _access_token: res.headers["access-token"],
        _client: res.headers.client,
        _uid: res.headers.uid,
      };
      Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));

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
      } else {
        showMessage({ title: "アカウントが作成できませんでした。", status: "error" });
      }
    }
    setLoading(false);
  };

  // -------------------------------------------------------------------------------------------

  return (
    <Flex align="center" justify="center" height="90vh" px={3}>
      <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          {appInfo.Info.appName}
        </Heading>
        <Divider my={4} />
        <Text fontSize="xl" textAlign="center">
          アカウント情報更新
        </Text>
        <Stack spacing={3} py={4} px={10}>
          <Input placeholder="名前" value={userName} onChange={onChangeName} aria-label="名前" />
          <Input
            placeholder="Eメールアドレス"
            value={userEmail}
            onChange={onChangeEmail}
            aria-label="Eメールアドレス"
          />
          <Input
            placeholder="パスワード"
            value={userPassword}
            type="password"
            onChange={onChangePassword}
            aria-label="パスワード"
          />
          <Input
            placeholder="パスワード再入力"
            value={userPasswordConfirmation}
            type="password"
            onChange={onClickPasswordConfirmation}
            aria-label="パスワード再入力"
          />

          <Box />
          <PrimaryButton
            disabled={userEmail === "" || userPassword === "" || userPasswordConfirmation === ""}
            onClick={handleSubmit}
            loading={loading}
          >
            更新
          </PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
