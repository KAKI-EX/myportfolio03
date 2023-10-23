import { Box, Flex, HStack, Icon, Image, Link, useDisclosure, VStack } from "@chakra-ui/react";
import { MenuIconButton } from "components/atoms/MenuIconButton";
import { MenuDrawer } from "components/molecules/MenuDrawer";
import { memo, useContext, VFC } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "App";
import { useSignOut } from "hooks/useSignOut";
import { useOnClickMakeMemo } from "hooks/useOnClickMakeMemo";
import { useOnClickAlert } from "hooks/useOnClickAlert";
import { useOnClickSearch } from "hooks/useOnClickSearch";
import { useOnClickMyPage } from "hooks/useOnClickMyPage";
import {
  BsCardChecklist,
  BsDoorOpen,
  BsJournalPlus,
  BsListColumnsReverse,
  BsPencilSquare,
  BsSearch,
} from "react-icons/bs";
import { GoSignOut } from "react-icons/go";
import { PiSignInLight } from "react-icons/pi";
import { MdOutlineAccountCircle } from "react-icons/md";

export const Header: VFC = memo(() => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onClickMakeMemo = useOnClickMakeMemo();
  const onClickAlert = useOnClickAlert();
  const onClickSearch = useOnClickSearch();
  const onClickMyPage = useOnClickMyPage();

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

  const onClickMemoIndex = () => {
    history.push("/okaimono");
    onClose();
  };
  const onClickShopShow = () => {
    history.push("/okaimono/okaimono_shop_index");
    onClose();
  };

  const { setLoading, isSignedIn } = useContext(AuthContext);

  const props = { setLoading };
  const { executionSignOut } = useSignOut(props);

  const onClickSignOut = () => {
    executionSignOut();
  };

  const textFontSize = ["sm", "sm", "sm", "md"];

  return (
    <>
      <Flex as="nav" bg="teal.500" color="gray.50" align="center" justify="space-between" padding={{ base: 3, md: 5 }}>
        <Box
          boxSize={{ base: "35%", sm: "35%", md: "18%", xl: "13%" }}
          _hover={{ cursor: "pointer" }}
          onClick={onClickHome}
        >
          <Image src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/logo_full.png" alt="logo" />
        </Box>
        <Flex fontSize="sm" flexGrow={2} display={{ base: "none", md: "flex" }} justifyContent="center">
          <Box pr={4} display={!isSignedIn ? "block" : "none"}>
            <VStack onClick={onClickSignIn} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
              <Icon
                as={PiSignInLight}
                h={8}
                w={8}
                _hover={{
                  h: "9",
                  w: "9",
                  cursor: "pointer",
                }}
              />
              <Link fontSize={textFontSize} onClick={onClickSignIn}>
                ログイン
              </Link>
            </VStack>
          </Box>
          <Box pr={4} display={!isSignedIn ? "block" : "none"}>
            <VStack onClick={onClickSignUp} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
              <Icon
                as={MdOutlineAccountCircle}
                h={8}
                w={8}
                _hover={{
                  h: "9",
                  w: "9",
                  cursor: "pointer",
                }}
              />
              <Link fontSize={textFontSize}>アカウント作成</Link>
            </VStack>
          </Box>
          <HStack spacing={4}>
            <Box pr={4} display={isSignedIn ? "block" : "none"}>
              <VStack onClick={onClickMakeMemo} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
                <Icon
                  as={BsJournalPlus}
                  h={8}
                  w={8}
                  _hover={{
                    h: "9",
                    w: "9",
                    cursor: "pointer",
                  }}
                />
                <Link fontSize={textFontSize}>メモの作成</Link>
              </VStack>
            </Box>
            <Box pr={4} display={isSignedIn ? "block" : "none"}>
              <VStack onClick={onClickMemoIndex} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
                <Icon
                  as={BsListColumnsReverse}
                  h={8}
                  w={8}
                  _hover={{
                    h: "9",
                    w: "9",
                    cursor: "pointer",
                  }}
                />
                <Link fontSize={textFontSize}>メモ一覧</Link>
              </VStack>
            </Box>
            <Box pr={4} display={isSignedIn ? "block" : "none"}>
              <VStack onClick={onClickAlert} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
                <Icon
                  as={BsCardChecklist}
                  h={8}
                  w={8}
                  _hover={{
                    h: "9",
                    w: "9",
                    cursor: "pointer",
                  }}
                />
                <Link fontSize={textFontSize}>アラート</Link>
              </VStack>
            </Box>
            <Box pr={4} display={isSignedIn ? "block" : "none"}>
              <VStack onClick={onClickSearch} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
                <Icon
                  as={BsSearch}
                  h={8}
                  w={8}
                  _hover={{
                    h: "9",
                    w: "9",
                    cursor: "pointer",
                  }}
                />
                <Link fontSize={textFontSize}>履歴サーチ</Link>
              </VStack>
            </Box>
            <Box pr={4} display={isSignedIn ? "block" : "none"}>
              <VStack onClick={onClickShopShow} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
                <Icon
                  as={BsPencilSquare}
                  h={8}
                  w={8}
                  _hover={{
                    h: "9",
                    w: "9",
                    cursor: "pointer",
                  }}
                />
                <Link fontSize={textFontSize}>お店編集</Link>
              </VStack>
            </Box>
            <Box pr={4} display={isSignedIn ? "block" : "none"}>
              <VStack onClick={onClickMyPage} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
                <Icon
                  as={BsDoorOpen}
                  h={8}
                  w={8}
                  _hover={{
                    h: "9",
                    w: "9",
                    cursor: "pointer",
                  }}
                />
                <Link fontSize={textFontSize}>マイページ</Link>
              </VStack>
            </Box>
            <Box pr={4} display={isSignedIn ? "block" : "none"}>
              <VStack onClick={onClickSignOut} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
                <Icon
                  as={GoSignOut}
                  h={8}
                  w={8}
                  _hover={{
                    h: "9",
                    w: "9",
                    cursor: "pointer",
                  }}
                />
                <Link fontSize={textFontSize} onClick={onClickSignOut}>
                  サインアウト
                </Link>
              </VStack>
            </Box>
          </HStack>
        </Flex>
        <MenuIconButton onOpen={onOpen} />
      </Flex>
      <MenuDrawer
        onClose={onClose}
        isOpen={isOpen}
        onClickSignIn={onClickSignIn}
        onClickSignUp={onClickSignUp}
        onClickMakeMemo={onClickMakeMemo}
        onClickSignOut={onClickSignOut}
        onClickMemoIndex={onClickMemoIndex}
        onClickShopShow={onClickShopShow}
        onClickAlert={onClickAlert}
        onClickSearch={onClickSearch}
        onClickMyPage={onClickMyPage}
      />
    </>
  );
});
