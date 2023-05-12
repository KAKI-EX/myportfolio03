import { Box, Flex, Heading, Link, useDisclosure } from "@chakra-ui/react";
import { MenuIconButton } from "components/atoms/MenuIconButton";
import { MenuDrawer } from "components/molecules/MenuDrawer";
import { appInfo } from "consts/appconst";
import Cookies from "js-cookie";
import { signOut } from "lib/api/auth";
import React, { memo, useCallback, useContext, VFC } from "react";
import { useHistory } from "react-router-dom";
import { useMessage } from "hooks/useToast";
import { AuthContext } from "App";

export const Header: VFC = memo(() => {
  console.log("ヘッダーが走っています");
  const history = useHistory();
  const { showMessage } = useMessage();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickSignIn = useCallback(() => history.push("/user/sign_in"), [history]);
  const onClickSignUp = useCallback(() => history.push("/user/sign_up"), [history]);
  const { setLoading } = useContext(AuthContext);

  const onClickSignOut = async () => {
    setLoading(true);
    console.log("onClickSignOutが走っています");
    try {
      const res = await signOut();
      if (res.data.success === true) {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");
        Cookies.remove("_user_id");
        Cookies.remove("_isLogin");
        showMessage({ title: "ログアウトしました。", status: "success" });
      }
    } catch (err: any) {
      console.log(err.response);
      if (err.response && err.response.data && err.response.data.errors) {
        showMessage({
          title: err.response.data.errors,
          status: "error",
        });
      } else {
        showMessage({ title: "ログアウトできませんでした。", status: "error" });
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Flex as="nav" bg="teal.500" color="gray.50" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
        <Flex align="center" as="a" mr={8} _hover={{ cursor: "pointer" }} onClick={onClickHome}>
          <Heading as="h1" fontSize={{ base: "md", md: "lg" }}>
            {appInfo.Info.appName}
          </Heading>
        </Flex>
        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: "none", md: "flex" }}>
          <Box pr={4}>
            <Link onClick={onClickSignIn}>ログイン</Link>
          </Box>
          <Box pr={4}>
            <Link onClick={onClickSignUp}>アカウントの作成</Link>
          </Box>
          <Box>
            <Link onClick={onClickSignOut}>サインアウト</Link>
          </Box>
        </Flex>
        <MenuIconButton onOpen={onOpen} />
      </Flex>
      <MenuDrawer
        onClose={onClose}
        isOpen={isOpen}
        onClickHome={onClickHome}
        onClickSignIn={onClickSignIn}
        onClickSignUp={onClickSignUp}
      />
    </>
  );
});
