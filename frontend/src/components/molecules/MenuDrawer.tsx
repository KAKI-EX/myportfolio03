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
};

export const MenuDrawer: VFC<Props> = memo((props) => {
  const { onClose, isOpen, onClickHome, onClickSignIn, onClickSignUp, onClickMakeMemo, onClickSignOut } = props;
  const { isSignedIn } = useContext(AuthContext);
  return (
    <Drawer placement="left" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={0} bg="gray.100">
            <Button onClick={onClickHome} w="100%">
              TOP
            </Button>
            <Button onClick={onClickSignIn} w="100%" display={!isSignedIn ? "block" : "none"}>
              サインイン
            </Button>
            <Button onClick={onClickSignUp} w="100%" display={!isSignedIn ? "block" : "none"}>
              アカウントの作成
            </Button>
            <Button onClick={onClickSignOut} w="100%" display={isSignedIn ? "block" : "none"}>
              サインアウト
            </Button>
            <Button onClick={onClickMakeMemo} w="100%" display={isSignedIn ? "block" : "none"}>
              お買物メモの作成
            </Button>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
});
