import {
  Box,
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
import { TbArrowBarToRight } from "react-icons/tb";
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
    <Box w="100%">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100" w={{ base: "95%", md: "50%" }} maxW="none">
          <ModalHeader>選択したアラートの情報</ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} data-testid="close-button" />
          <ModalBody w="100%" overflowX="hidden">
            <VStack w="100%" alignItems="left" bg="white" boxShadow="md" rounded={10}>
              <TableContainer w="100%">
                <Table w="100%">
                  <TableCaption
                    _hover={{ fontWeight: "bold", cursor: "pointer" }}
                    onClick={(event) => onClickShowMemo(event, alertListDetail?.shoppingDatumId)}
                    textAlign="center"
                  >
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
                        <Icon as={TbArrowBarToRight} w={5} h={5} mb={-1} mr={1} />
                        消費期限
                      </Td>
                      <Td fontSize={{ base: "sm", md: "md" }}>{dateConversion(alertListDetail?.expiryDateEnd)}</Td>
                    </Tr>
                    <Tr>
                      <Td fontSize={{ base: "sm", md: "md" }}>
                        <Icon as={BsShopWindow} w={5} h={5} mb={-1} mr={1} />
                        お店の名前
                      </Td>
                      <Td
                        fontSize={{ base: "sm", md: "md" }}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        maxW={{ base: "150px", md: "200px" }} // この部分を変更
                      >
                        {alertListShop?.shopName}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontSize={{ base: "sm", md: "md" }}>
                        <Icon as={AiOutlineMoneyCollect} w={5} h={5} mb={-1} mr={1} />
                        価格
                      </Td>
                      <Td fontSize={{ base: "sm", md: "md" }}>
                        {alertListDetail?.price ? `${alertListDetail?.price}  円` : "入力なし"}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontSize={{ base: "sm", md: "md" }}>
                        <Icon as={BiCube} w={5} h={5} mb={-1} mr={1} />
                        個数
                      </Td>
                      <Td fontSize={{ base: "sm", md: "md" }}>
                        {alertListDetail?.amount ? `${alertListDetail?.amount}  つ` : "入力なし"}
                      </Td>
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
    </Box>
  );
});
