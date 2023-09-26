import { Box, Flex, Heading, Image, Link, useDisclosure } from "@chakra-ui/react";
import { MenuIconButton } from "components/atoms/MenuIconButton";
import { MenuDrawer } from "components/molecules/MenuDrawer";
import { appInfo } from "consts/appconst";
import { memo, useCallback, useContext, VFC } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "App";
import { useSignOut } from "hooks/useSignOut";

export const Header: VFC = memo(() => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickHome = useCallback(() => history.push("/"), [history]);
  const onClickSignIn = useCallback(() => history.push("/user/sign_in"), [history]);
  const onClickSignUp = useCallback(() => history.push("/user/sign_up"), [history]);
  const onClickMakeMemo = useCallback(() => history.push("/okaimono/okaimono_memo"), [history]);
  const onClickMemoIndex = useCallback(() => history.push("/okaimono"), [history]);
  const onClickShopShow = useCallback(() => history.push("/okaimono/okaimono_shop_index"), [history]);
  // const onClickMemoUse = useCallback(() => history.push("/okaimono/okaimono_memo_use"), [history]);
  const onClickAlert = useCallback(() => history.push("/okaimono/okaimono_alert"), [history]);
  const onClickSearch = useCallback(() => history.push("/okaimono/okaimono_search"), [history]);
  const onClickMyPage = useCallback(() => history.push("/user/"), [history]);

  const { setLoading, isSignedIn } = useContext(AuthContext);

  const props = { setLoading };
  const { executionSignOut } = useSignOut(props);

  const onClickSignOut = () => {
    executionSignOut();
  };

  return (
    <>
      <Flex as="nav" bg="teal.500" color="gray.50" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
        <Flex align="center" as="a" mr={8} _hover={{ cursor: "pointer" }} onClick={onClickHome}>
          <Box boxSize="60%">
            <Image boxSize="100%" src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/logo_full.png" alt="logo" />
          </Box>
        </Flex>
        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: "none", md: "flex" }}>
          <Box pr={4}>
            <Link onClick={onClickSignIn} display={!isSignedIn ? "block" : "none"}>
              ログイン
            </Link>
          </Box>
          <Box pr={4} display={!isSignedIn ? "block" : "none"}>
            <Link onClick={onClickSignUp}>アカウントの作成</Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link onClick={onClickSignOut}>サインアウト</Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link onClick={onClickMakeMemo}>お買い物メモの作成</Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link onClick={onClickMemoIndex}>お買物メモ一覧</Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link onClick={onClickShopShow}>お店情報の確認と編集</Link>
          </Box>
          {/* <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link onClick={onClickMemoUse}>お買い物メモを使う</Link>
          </Box> */}
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link onClick={onClickAlert}>消費期限アラート</Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link onClick={onClickSearch}>お買い物サーチ</Link>
          </Box>
        </Flex>
        <MenuIconButton onOpen={onOpen} />
      </Flex>
      <MenuDrawer
        onClose={onClose}
        isOpen={isOpen}
        // onClickHome={onClickHome}
        onClickSignIn={onClickSignIn}
        onClickSignUp={onClickSignUp}
        onClickMakeMemo={onClickMakeMemo}
        onClickSignOut={onClickSignOut}
        onClickMemoIndex={onClickMemoIndex}
        onClickShopShow={onClickShopShow}
        // onClickMemoUse={onClickMemoUse}
        onClickAlert={onClickAlert}
        onClickSearch={onClickSearch}
        onClickMyPage={onClickMyPage}
      />
    </>
  );
});
