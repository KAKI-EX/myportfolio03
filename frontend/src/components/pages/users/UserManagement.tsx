import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useAccountDestroy } from "hooks/useAccountDestroy";
import React, { memo, useCallback, VFC } from "react";
import { useHistory } from "react-router-dom";

export const UserManagement: VFC = memo(() => {
  // const onClickAccountModify = () => {
  //   console.log("アカウント情報の編集");
  // };
  const textFontSize = ["sm", "md", "md", "xl"];
  const history = useHistory();
  const onClickTermOfService = useCallback(() => history.push("/user/term_of_service"), [history]);
  const onClickUserUpdate = useCallback(() => history.push("/user/account_update"), [history]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const accountDelete = useAccountDestroy(onClose);

  const cancelRef = React.useRef(null);

  const onClickAccountDelete = () => {
    accountDelete();
  };

  return (
    <Box>
      <Heading as="h1" size="lg" textAlign="center" my={5}>
        マイページ
      </Heading>
      <Center pt={10} onClick={onClickUserUpdate}>
        <Text
          _hover={{ fontWeight: "bold", cursor: "pointer" }}
          bg="blue.50"
          w="70%"
          textAlign="center"
          borderTop="1px"
          borderColor="gray.400"
          py={4}
          fontSize={textFontSize}
        >
          アカウント情報の編集する
        </Text>
      </Center>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              本当にアカウントを削除しますか？
            </AlertDialogHeader>

            <AlertDialogBody>今まで登録したデータは削除され、元に戻すことはできません。</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button colorScheme="red" onClick={onClickAccountDelete} ml={3}>
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Center onClick={onClickTermOfService}>
        <Text
          _hover={{ fontWeight: "bold", cursor: "pointer" }}
          bg="blue.50"
          w="70%"
          textAlign="center"
          px={10}
          borderTop="1px"
          borderColor="gray.400"
          py={4}
          fontSize={textFontSize}
        >
          利用規約
        </Text>
      </Center>
      <Center>
        <Text
          _hover={{ fontWeight: "bold", cursor: "pointer" }}
          bg="red.50"
          w="70%"
          textAlign="center"
          px={10}
          borderTop="1px"
          borderColor="gray.400"
          py={4}
          fontSize={textFontSize}
          onClick={onOpen}
        >
          アカウント情報を削除する
        </Text>
      </Center>
      {/* <Center>
        <Text
          bg="blue.50"
          w="70%"
          textAlign="center"
          px={10}
          borderY="1px"
          borderColor="gray.400"
          py={4}
          fontSize={textFontSize}
        >
          操作方法
        </Text>
      </Center> */}
    </Box>
  );
});
