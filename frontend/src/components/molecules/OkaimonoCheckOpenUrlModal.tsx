import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { memo, VFC } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  isOpenUrl: boolean;
  onCloseUrl: () => void;
  openMessage: string | undefined;
  register: UseFormRegister<FieldValues>;
  onClickUrlCopy: () => void;
};

export const OkaimonoCheckOpenUrlModal: VFC<Props> = memo((props) => {
  const { isOpenUrl, onCloseUrl, openMessage, register, onClickUrlCopy } = props;

  return (
    <Modal isOpen={isOpenUrl} onClose={onCloseUrl}>
      <ModalOverlay />
      <ModalContent maxW="95vw">
        <ModalHeader>公開用URL</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Text fontSize={{ base: "sm", md: "md" }}>{openMessage}</Text>
            <InputGroup>
              <Input pr="4.5rem" {...register("openMemoUrl")} />
              <InputRightElement width="3.5rem">
                <Button colorScheme="blue" h="1.75rem" size="sm" color="white" onClick={onClickUrlCopy}>
                  コピー
                </Button>
              </InputRightElement>
            </InputGroup>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onCloseUrl}>閉じる</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
