import {
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { ListFormParams, OkaimonoShopsIndexData } from "interfaces";
import React, { memo, VFC } from "react";
import { TbArrowBarRight, TbArrowBarToRight } from "react-icons/tb";
import { useDateConversion } from "hooks/useDateConversion";
import { BsCartCheck, BsShopWindow } from "react-icons/bs";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { BiCube } from "react-icons/bi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onClickShowMemo: (event: React.MouseEvent, id?: string) => void;
  alertListDetail: ListFormParams | null | undefined;
  alertListShop: OkaimonoShopsIndexData | null | undefined;
  onClickClose: () => void;
};

export const OkaimonoAlertModal: VFC<Props> = memo((props) => {
  const { isOpen, onClose, onClickShowMemo, alertListDetail, alertListShop, onClickClose } = props;
  const { dateConversion } = useDateConversion();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.100" maxW="95vw">
        <ModalHeader>選択したアラートの情報</ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: "none" }} data-testid="close-button" />
        <ModalBody>
          <VStack alignItems="left" bg="white" boxShadow="md" rounded={10}>
            <TableContainer>
              <Table variant="simple">
                <TableCaption onClick={(event) => onClickShowMemo(event, alertListDetail?.shoppingDatumId)}>
                  実際のお買い物メモを見る
                </TableCaption>
                <Tbody>
                  <Tr>
                    <Td fontSize={{ base: "sm", md: "md" }}>
                      <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
                      購入日
                    </Td>
                    <Td fontSize={{ base: "sm", md: "md" }}>{dateConversion(alertListDetail?.shoppingDate)}</Td>
                  </Tr>
                  <Tr>
                    <Td fontSize={{ base: "sm", md: "md" }}>
                      <Icon as={TbArrowBarRight} w={5} h={5} mb={-1} mr={1} />
                      消費期限 開始
                    </Td>
                    <Td fontSize={{ base: "sm", md: "md" }}>{dateConversion(alertListDetail?.expiryDateStart)}</Td>
                  </Tr>
                  <Tr>
                    <Td fontSize={{ base: "sm", md: "md" }}>
                      <Icon as={TbArrowBarToRight} w={5} h={5} mb={-1} mr={1} />
                      消費期限 終了
                    </Td>
                    <Td fontSize={{ base: "sm", md: "md" }}>{dateConversion(alertListDetail?.expiryDateEnd)}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Icon as={BsShopWindow} w={5} h={5} mb={-1} mr={1} />
                      お店の名前
                    </Td>
                    <Td>{alertListShop?.shopName}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Icon as={AiOutlineMoneyCollect} w={5} h={5} mb={-1} mr={1} />
                      価格
                    </Td>
                    <Td>{`${alertListDetail?.price}  円`}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Icon as={BiCube} w={5} h={5} mb={-1} mr={1} />
                      個数
                    </Td>
                    <Td>{`${alertListDetail?.amount}  つ`}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button bg="gray.400" color="white" mr={3} onClick={onClickClose}>
              閉じる
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
