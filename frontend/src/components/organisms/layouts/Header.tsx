import {
  Box,
  Flex,
  Heading,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { MenuIconButton } from "components/atoms/MenuIconButton";
import { MenuDrawer } from "components/molecules/MenuDrawer";
import { appInfo } from "consts/appconst";
import { memo, useCallback, VFC } from "react";
import { useHistory } from "react-router-dom";

export const Header: VFC = memo(() => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickSignIn = useCallback(
    () => history.push("/user/sign_in"),
    [history]
  );
  const onClickSignUp = useCallback(
    () => history.push("/user/sign_up"),
    [history]
  );

  return (
    <>
      <Flex
        as="nav"
        bg="teal.500"
        color="gray.50"
        align="center"
        justify="space-between"
        padding={{ base: 3, md: 5 }}
      >
        <Flex
          align="center"
          as="a"
          mr={8}
          _hover={{ cursor: "pointer" }}
          onClick={onClickHome}
        >
          <Heading as="h1" fontSize={{ base: "md", md: "lg" }}>
            {appInfo.Info.appName}
          </Heading>
        </Flex>
        <Flex
          align="center"
          fontSize="sm"
          flexGrow={2}
          display={{ base: "none", md: "flex" }}
        >
          <Box pr={4}>
            <Link onClick={onClickSignIn}>ログイン</Link>
          </Box>
          <Box>
            <Link onClick={onClickSignUp}>ログイン</Link>
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
