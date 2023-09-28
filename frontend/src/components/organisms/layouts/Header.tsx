import { Box, Flex, Image, Link, useDisclosure } from "@chakra-ui/react";
import { MenuIconButton } from "components/atoms/MenuIconButton";
import { MenuDrawer } from "components/molecules/MenuDrawer";
import { memo, useContext, VFC } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "App";
import { useSignOut } from "hooks/useSignOut";

export const Header: VFC = memo(() => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickHome = () => {
    history.push("/");
    onClose();
  };
  const onClickSignIn = () => {
    history.push("/user/sign_in");
    onClose();
  };
  const onClickSignUp = () => {
    history.push("/user/sign_up");
    onClose();
  };
  const onClickMakeMemo = () => {
    history.push("/okaimono/okaimono_memo");
    onClose();
  };
  const onClickMemoIndex = () => {
    history.push("/okaimono");
    onClose();
  };
  const onClickShopShow = () => {
    history.push("/okaimono/okaimono_shop_index");
    onClose();
  };
  const onClickAlert = () => {
    history.push("/okaimono/okaimono_alert");
    onClose();
  };
  const onClickSearch = () => {
    history.push("/okaimono/okaimono_search");
    onClose();
  };
  const onClickMyPage = () => {
    history.push("/user/");
    onClose();
  };

  const { setLoading, isSignedIn } = useContext(AuthContext);

  const props = { setLoading };
  const { executionSignOut } = useSignOut(props);

  const onClickSignOut = () => {
    executionSignOut();
  };

  const textFontSize = ["sm", "md", "md", "xl"];

  return (
    <>
      <Flex as="nav" bg="teal.500" color="gray.50" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
        <Flex align="center" as="a" mr={8} _hover={{ cursor: "pointer" }} onClick={onClickHome}>
          <Box boxSize="60%">
            <Image
              boxSize="100%"
              src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/logo_full.png"
              alt="logo"
            />
          </Box>
        </Flex>
        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: "none", md: "flex" }}>
          <Box pr={4}>
            <Link fontSize={textFontSize} onClick={onClickSignIn} display={!isSignedIn ? "block" : "none"}>
              ログイン
            </Link>
          </Box>
          <Box pr={4} display={!isSignedIn ? "block" : "none"}>
            <Link fontSize={textFontSize} onClick={onClickSignUp}>
              アカウントの作成
            </Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link fontSize={textFontSize} onClick={onClickMakeMemo}>
              メモの作成
            </Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link fontSize={textFontSize} onClick={onClickMemoIndex}>
              メモ一覧
            </Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link fontSize={textFontSize} onClick={onClickAlert}>
              アラート
            </Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link fontSize={textFontSize} onClick={onClickSearch}>
              サーチ
            </Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link fontSize={textFontSize} onClick={onClickShopShow}>
              お店情報の確認と編集
            </Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link fontSize={textFontSize} onClick={onClickMyPage}>
              マイページ
            </Link>
          </Box>
          <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link fontSize={textFontSize} onClick={onClickSignOut}>
              サインアウト
            </Link>
          </Box>
          {/* <Box pr={4} display={isSignedIn ? "block" : "none"}>
            <Link onClick={onClickMemoUse}>お買い物メモを使う</Link>
          </Box> */}
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
