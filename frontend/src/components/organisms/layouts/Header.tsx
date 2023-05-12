import { Box, Flex, Heading, Link, useDisclosure } from "@chakra-ui/react";
import { MenuIconButton } from "components/atoms/MenuIconButton";
import { MenuDrawer } from "components/molecules/MenuDrawer";
import { appInfo } from "consts/appconst";
import { memo, useCallback, useContext, VFC } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "App";
import { useSignOut } from "hooks/useSignOut";

export const Header: VFC = memo(() => {
  console.log("ヘッダーが走っています");
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickSignIn = useCallback(() => history.push("/user/sign_in"), [history]);
  const onClickSignUp = useCallback(() => history.push("/user/sign_up"), [history]);
  const { setLoading } = useContext(AuthContext);

  const props = { setLoading };
  const { executionSignOut } = useSignOut(props);

  const onClickSignOut = () => {
    executionSignOut();
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
