import {
  Button,
  HStack,
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
import { useGetNickname } from "hooks/useGetNickname";
import { UserInputParams } from "interfaces";
import React, { memo, useEffect, useRef, useState, VFC } from "react";
import { FieldValues, UseFormGetValues, UseFormRegister } from "react-hook-form";
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

type Props = {
  isOpenUrl: boolean;
  onCloseUrl: () => void;
  openMessage: string | undefined;
  register: UseFormRegister<FieldValues>;
  onClickUrlCopy: () => void;
  getValues: UseFormGetValues<FieldValues>;
  memoId: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onClickShowMemo: (id: string) => (event: React.MouseEvent) => void;
};

export const OkaimonoCheckOpenUrlModal: VFC<Props> = memo((props) => {
  const { isOpenUrl, onCloseUrl, openMessage, register, onClickUrlCopy, getValues, memoId, onClickShowMemo } = props;
  const [nickname, setNickname] = useState<UserInputParams>();
  const isMounted = useRef(true);
  const fNProps = {
    setNickname,
    isMounted,
  };
  const fetchNickname = useGetNickname(fNProps);

  useEffect(() => {
    fetchNickname();
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const URL = getValues("openMemoUrl");
  const QUOTE = `${nickname}さんがおつかいをしてほしいそうです！`;

  return (
    <Modal isOpen={isOpenUrl} onClose={onCloseUrl}>
      <ModalOverlay />
      <ModalContent maxW="95vw" w={{ base: "100%", md: "60%", xl: "50%" }}>
        <ModalHeader>公開用URL</ModalHeader>
        <ModalCloseButton data-testid="modalCloseButton" />
        <ModalBody>
          <VStack>
            <Text fontSize={{ base: "sm", md: "md" }}>{openMessage}</Text>
            {memoId ? (
              <Text fontSize={{ base: "sm", md: "md" }}>
                設定を変更したい場合は
                <Text as="ins" onClick={onClickShowMemo(memoId)} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
                  こちらのページから
                </Text>
              </Text>
            ) : null}
            <InputGroup>
              <Input pr="4.5rem" {...register("openMemoUrl")} />
              <InputRightElement width="3.5rem">
                <Button colorScheme="blue" h="1.75rem" size="sm" color="white" onClick={onClickUrlCopy} disabled={URL === "非公開"}>
                  コピー
                </Button>
              </InputRightElement>
            </InputGroup>
            <HStack>
              <FacebookShareButton url={URL} quote={QUOTE}>
                <FacebookIcon size={24} round />
              </FacebookShareButton>
              <TwitterShareButton url={URL} title={QUOTE}>
                <TwitterIcon size={24} round />
              </TwitterShareButton>
              <LineShareButton url={URL} title={QUOTE}>
                <LineIcon size={24} round />
              </LineShareButton>
              <WhatsappShareButton url={URL} title={QUOTE}>
                <WhatsappIcon size={24} round />
              </WhatsappShareButton>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onCloseUrl}>閉じる</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
