import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { AuthContext } from "App";
import { memo, useContext, VFC } from "react";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  onClickHome: () => void;
  onClickSignIn: () => void;
  onClickSignUp: () => void;
  onClickMakeMemo: () => void;
  onClickSignOut: () => void;
  onClickMemoIndex: () => void;
  onClickShopShow: () => void;
};

export const MenuDrawer: VFC<Props> = memo((props) => {
  const {
    onClose,
    isOpen,
    onClickHome,
    onClickSignIn,
    onClickSignUp,
    onClickMakeMemo,
    onClickSignOut,
    onClickMemoIndex,
    onClickShopShow
  } = props;
  const { isSignedIn } = useContext(AuthContext);
  return (
    <Drawer placement="left" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={0} bg="gray.100">
            {/* --------------------------------------未ログイン時表示------------------------------------------- */}
            <Button onClick={onClickHome} w="100%" _focus={{ outline: "none" }}>
              TOP
            </Button>
            <Button
              onClick={onClickSignIn}
              w="100%"
              display={!isSignedIn ? "block" : "none"}
              _focus={{ outline: "none" }}
            >
              サインイン
            </Button>
            <Button
              onClick={onClickSignUp}
              w="100%"
              display={!isSignedIn ? "block" : "none"}
              _focus={{ outline: "none" }}
            >
              アカウントの作成
            </Button>
            {/* --------------------------------------ログイン時表示------------------------------------------- */}
            <Button
              onClick={onClickMakeMemo}
              w="100%"
              display={isSignedIn ? "block" : "none"}
              _focus={{ outline: "none" }}
            >
              お買物メモの作成
            </Button>
            <Button
              onClick={onClickMemoIndex}
              w="100%"
              display={isSignedIn ? "block" : "none"}
              _focus={{ outline: "none" }}
            >
              お買物メモ一覧
            </Button>
            <Button
              onClick={onClickShopShow}
              w="100%"
              display={isSignedIn ? "block" : "none"}
              _focus={{ outline: "none" }}
            >
              お店情報の確認と編集
            </Button>
            <Button
              onClick={onClickSignOut}
              w="100%"
              display={isSignedIn ? "block" : "none"}
              _focus={{ outline: "none" }}
            >
              サインアウト
            </Button>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
});
