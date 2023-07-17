import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { OkaimonoMemoData } from "interfaces";
import React, { memo, VFC } from "react";
import { useDateConversion } from "hooks/useDateConversion";

type Props = {
  onCloseAlert: () => void
  isAlertOpen: boolean;
  cancelRef: React.MutableRefObject<null>;
  deletePost: OkaimonoMemoData | undefined;
  // eslint-disable-next-line no-unused-vars
  onClickDelete: (deleteId: OkaimonoMemoData) => void;
};

export const DeleteConfimationDialog: VFC<Props> = memo((props) => {
  const { onCloseAlert, isAlertOpen, cancelRef, deletePost, onClickDelete } = props;
  const { dateConversion } = useDateConversion();

  return (
    <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onCloseAlert}>
      <AlertDialogOverlay>
        <AlertDialogContent maxW="95vw">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {dateConversion(deletePost?.shoppingDate)} のメモを削除しますか？
          </AlertDialogHeader>
          <AlertDialogBody>メモに保存されているリストも削除されます。</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onCloseAlert}>
              やっぱりやめる
            </Button>
            <Button colorScheme="red" onClick={() => (deletePost ? onClickDelete(deletePost) : undefined)} ml={3}>
              削除する
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
});
