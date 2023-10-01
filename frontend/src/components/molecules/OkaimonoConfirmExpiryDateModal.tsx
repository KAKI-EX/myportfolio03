import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { memo, VFC } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClickInputNow: () => void;
};

export const OkaimonoConfirmExpiryDateModal: VFC<Props> = memo((props) => {
  const { isOpen, onClose, onClickInputNow } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="95vw" w={{ base: "100%", md: "60%", xl: "50%" }}>
        <ModalHeader>いま消費期限を入力しますか？</ModalHeader>
        <ModalCloseButton />
        <ModalBody>お買い物をする時にも入力できますよ！</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            今はしない
          </Button>
          <Button variant="ghost" onClick={onClickInputNow}>
            今入力したい
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
