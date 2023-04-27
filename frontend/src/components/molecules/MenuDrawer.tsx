import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import { memo, VFC } from "react";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  onClickHome: () => void;
  onClickSignIn: () => void;
  onClickSignUp: () => void;
};

export const MenuDrawer: VFC<Props> = memo((props) => {
  const { onClose, isOpen, onClickHome, onClickSignIn, onClickSignUp } = props;
  return (
    <Drawer placement="left" size="xs" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={0} bg="gray.100">
            <Button onClick={onClickHome} w="100%">
              TOP
            </Button>
            <Button onClick={onClickSignIn} w="100%">
              サインイン
            </Button>
            <Button onClick={onClickSignUp} w="100%">
              アカウントの作成
            </Button>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
});
