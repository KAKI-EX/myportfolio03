import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
} from "@chakra-ui/react";
import { AuthContext } from "App";
import { memo, useContext, VFC } from "react";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  // onClickHome: () => void;
  onClickSignIn: () => void;
  onClickSignUp: () => void;
  onClickMakeMemo: () => void;
  onClickSignOut: () => void;
  onClickMemoIndex: () => void;
  onClickShopShow: () => void;
  // onClickMemoUse: () => void;
  onClickAlert: () => void;
  onClickSearch: () => void;
  onClickMyPage: () => void;
};

export const MenuDrawer: VFC<Props> = memo((props) => {
  const {
    onClose,
    isOpen,
    // onClickHome,
    onClickSignIn,
    onClickSignUp,
    onClickMakeMemo,
    onClickSignOut,
    onClickMemoIndex,
    onClickShopShow,
    // onClickMemoUse,
    onClickAlert,
    onClickSearch,
    onClickMyPage
  } = props;
  const { isSignedIn } = useContext(AuthContext);

  return (
    <Drawer placement="left" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton _focus={{ outline: "none" }} />
        <DrawerHeader bg="gray.100" textAlign="center" borderBottom="1px" borderColor="gray.400" borderRadius={0}>
          お買い物メニュー
        </DrawerHeader>
        <DrawerBody p={0} bg="gray.100">
          {/* --------------------------------------未ログイン時表示------------------------------------------- */}
          {/* <HStack>
            <Button justifyContent="flex-start" onClick={onClickHome} w="100%" _focus={{ outline: "none" }}>
              TOP
            </Button>
            <Box pr={5}>
              <ChevronRightIcon />
            </Box>
          </HStack> */}
          {!isSignedIn && (
            <HStack borderTop="1px" borderColor="gray.300">
              <Button onClick={onClickSignIn} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                サインイン
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
          {!isSignedIn && (
            <HStack borderTop="1px" borderBottom="1px" borderColor="gray.300">
              <Button onClick={onClickSignUp} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                アカウントの作成
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
          {/* --------------------------------------ログイン時表示------------------------------------------- */}
          {isSignedIn && (
            <HStack borderTop="1px" borderColor="gray.300">
              <Button onClick={onClickMakeMemo} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                メモの作成
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
          {isSignedIn && (
            <HStack borderTop="1px" borderColor="gray.300">
              <Button onClick={onClickMemoIndex} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                メモ一覧
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
          {/* <Button
              onClick={onClickMemoUse}
              w="100%"
              display={isSignedIn ? "block" : "none"}
              _focus={{ outline: "none" }}
            >
              お買い物メモを使う
            </Button> */}
          {isSignedIn && (
            <HStack borderTop="1px" borderColor="gray.300">
              <Button onClick={onClickAlert} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                アラート
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
          {isSignedIn && (
            <HStack borderTop="1px" borderColor="gray.300">
              <Button onClick={onClickSearch} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                サーチ
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
          {isSignedIn && (
            <HStack borderTop="1px" borderColor="gray.300">
              <Button onClick={onClickShopShow} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                お店情報の確認と編集
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
          {isSignedIn && (
            <HStack borderTop="1px" borderColor="gray.300">
              <Button onClick={onClickMyPage} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                マイページ
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
          {isSignedIn && (
            <HStack borderTop="1px" borderBottom="1px" borderColor="gray.300">
              <Button onClick={onClickSignOut} w="100%" _focus={{ outline: "none" }} justifyContent="flex-start">
                サインアウト
              </Button>
              <Box pr={5}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
});
