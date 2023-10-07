import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { OkaimonoMemoData } from "interfaces";
import React, { memo, VFC } from "react";
import { TableThread } from "components/molecules/TableThread";
import { useDateConversion } from "hooks/useDateConversion";
import { BsCardChecklist, BsShare, BsTrash3 } from "react-icons/bs";

type Props = {
  // eslint-disable-next-line no-unused-vars
  onClickShowMemo: (id: string) => (event: React.MouseEvent) => void;
  setDeletePost: React.Dispatch<React.SetStateAction<OkaimonoMemoData | undefined>>;
  onAlertOpen: () => void;
  readyShoppingMemo: OkaimonoMemoData[] | null | undefined;
  // eslint-disable-next-line no-unused-vars
  onClickMemoUse: (id: string) => (event: React.MouseEvent) => void;
  // eslint-disable-next-line no-unused-vars
  onClickShowOpenUrl: (shoppingDatumId: string, event: React.MouseEvent) => void;
};

export const OkaimonoIndexTabPanelConfimed: VFC<Props> = memo((props) => {
  const { onClickShowMemo, setDeletePost, onAlertOpen, readyShoppingMemo, onClickMemoUse, onClickShowOpenUrl } = props;
  const { dateConversion } = useDateConversion();
  return (
    <Table variant="simple" w="100%" bg="white" rounded={10}>
      <TableThread isFinished={readyShoppingMemo && readyShoppingMemo[0] ? readyShoppingMemo[0].isFinish : undefined} />
      {readyShoppingMemo?.map((i: OkaimonoMemoData) => {
        return (
          <Tbody key={i.id} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
            <Tr>
              <Td borderTop="1px" borderColor="gray.300" fontSize={{ base: "xs", md: "md" }} textAlign="center" px={0}>
                <Button
                  border="1px"
                  h={7}
                  fontSize={{ base: "xs", md: "md" }}
                  bg={i.isOpen ? "teal.500" : "gray.400"}
                  color="white"
                  onClick={(event) => onClickShowOpenUrl(i.id, event)}
                >
                  {i.isOpen ? "公開中" : "非公開"}
                </Button>
              </Td>
              <Td
                borderTop="1px"
                borderColor="gray.300"
                fontSize={{ base: "sm", md: "md" }}
                textAlign="center"
                onClick={onClickMemoUse(i.id)}
                px={0}
              >
                {dateConversion(i.shoppingDate)}
              </Td>
              {i.isFinish === false ? null : (
                <Td
                  borderTop="1px"
                  borderColor="gray.300"
                  fontSize={{ base: "sm", md: "md" }}
                  textAlign="center"
                  onClick={onClickMemoUse(i.id)}
                >
                  {i.memosCount}
                </Td>
              )}

              <Td
                borderTop="1px"
                borderColor="gray.300"
                fontSize={{ base: "sm", md: "md" }}
                display={{ base: "none", md: "table-cell" }}
                textAlign="center"
                onClick={onClickMemoUse(i.id)}
              >
                {i.totalBudget}円
              </Td>
              <Td
                px="17px"
                borderTop="1px"
                borderColor="gray.300"
                fontSize={{ base: "sm", md: "md" }}
                textAlign="center"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                maxWidth="100px"
                onClick={onClickMemoUse(i.id)}
              >
                {i.shoppingMemo}
              </Td>
              <Td px="0" borderTop="1px" borderColor="gray.300" textAlign="center" display={{ base: "table-cell" }}>
                <Menu>
                  <MenuButton as={ChevronDownIcon} _hover={{ cursor: "pointer" }} />
                  <MenuList borderRadius="md" shadow="md">
                    {/* <MenuItem onClick={onClickMemoUse(i.id)}>お買い物で使ってみる！</MenuItem> */}
                    <MenuItem onClick={onClickShowMemo(i.id)}>
                      <HStack>
                        <Icon as={BsCardChecklist} w={4} h={4} ml={3} />
                        <Text>確認</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem onClick={(event) => onClickShowOpenUrl(i.id, event)}>
                      <HStack>
                        <Icon as={BsShare} w={4} h={4} ml={3} />
                        <Text>おつかい（シェア）</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setDeletePost(i);
                        onAlertOpen();
                      }}
                    >
                      <HStack>
                        <Icon as={BsTrash3} w={4} h={4} ml={3} />
                        <Text>削除</Text>
                      </HStack>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        );
      })}
    </Table>
  );
});
