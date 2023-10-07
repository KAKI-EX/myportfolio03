import { ChevronDownIcon } from "@chakra-ui/icons";
import { HStack, Icon, Menu, MenuButton, MenuItem, MenuList, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import { OkaimonoMemoData } from "interfaces";
import React, { memo, VFC } from "react";
import { TableThread } from "components/molecules/TableThread";
import { useDateConversion } from "hooks/useDateConversion";
import { BsCardChecklist, BsTrash3 } from "react-icons/bs";
import { CiEraser } from "react-icons/ci";

type Props = {
  // eslint-disable-next-line no-unused-vars
  onClickShowMemo: (id: string) => (event: React.MouseEvent) => void;
  setDeletePost: React.Dispatch<React.SetStateAction<OkaimonoMemoData | undefined>>;
  onAlertOpen: () => void;
  finishedMemo: OkaimonoMemoData[] | null | undefined;
};

export const OkaimonoIndexTabPanelCompleted: VFC<Props> = memo((props) => {
  const { onClickShowMemo, setDeletePost, onAlertOpen, finishedMemo } = props;
  const { dateConversion } = useDateConversion();

  return (
    <Table variant="simple" w="100%" bg="white" rounded={10}>
      <TableThread />
      {finishedMemo?.map((i: OkaimonoMemoData) => {
        return (
          <Tbody key={i.id} _hover={{ fontWeight: "bold", cursor: "pointer" }}>
            <Tr>
              <Td
                borderTop="1px"
                borderColor="gray.300"
                fontSize={{ base: "sm", md: "md" }}
                textAlign="center"
                onClick={onClickShowMemo(i.id)}
                px={0}
              >
                {dateConversion(i.shoppingDate)}
              </Td>
              <Td
                borderTop="1px"
                borderColor="gray.300"
                fontSize={{ base: "sm", md: "md" }}
                // display={{ base: "none", md: "table-cell" }}
                textAlign="center"
                onClick={onClickShowMemo(i.id)}
              >
                {i.memosCount}
              </Td>
              <Td
                borderTop="1px"
                borderColor="gray.300"
                fontSize={{ base: "sm", md: "md" }}
                display={{ base: "none", md: "table-cell" }}
                textAlign="center"
                onClick={onClickShowMemo(i.id)}
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
                onClick={onClickShowMemo(i.id)}
              >
                {i.shoppingMemo}
              </Td>
              <Td px="0" borderTop="1px" borderColor="gray.300" textAlign="center" display={{ base: "table-cell" }}>
                <Menu>
                  <MenuButton as={ChevronDownIcon} />
                  <MenuList borderRadius="md" shadow="md">
                    <MenuItem onClick={onClickShowMemo(i.id)}>
                      <HStack>
                        <Icon as={BsCardChecklist} w={4} h={4} ml={3} />
                        <Text>確認する</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem onClick={onClickShowMemo(i.id)}>
                      <HStack>
                        <Icon as={CiEraser} w={4} h={4} ml={3} />
                        <Text>修正する</Text>
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
                        <Text>削除する</Text>
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
