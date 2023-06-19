import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import React, { memo, VFC } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  readOnly: boolean;
  register: UseFormRegister<MergeParams>;
  errors: FieldErrors<MergeParams>;
  onClickShoppingDatumModify: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const OkaimonoMemoUseMemo: VFC<Props> = memo((props) => {
  const { readOnly, register, errors, onClickShoppingDatumModify } = props;
  return (
    <Box bg="white" rounded="xl" w={{ base: "100%", md: "50%" }} boxShadow="md">
      <HStack>
        <Stack align="center" justify="center" py={6} spacing="3" w="95%" ml={5}>
          <Input
            isReadOnly={readOnly}
            bg={readOnly ? "blackAlpha.200" : "white"}
            size="md"
            type="date"
            w="100%"
            fontSize={{ base: "sm", md: "md" }}
            {...register("shoppingDate")}
          />
          <Input
            isReadOnly={readOnly}
            bg={readOnly ? "blackAlpha.200" : "white"}
            placeholder={readOnly ? "お店の名前" : ""}
            size="md"
            w="100%"
            fontSize={{ base: "sm", md: "md" }}
            {...register("shopName", {
              maxLength: { value: 35, message: "最大文字数は35文字までです。" },
            })}
          />
          {errors.shopName && errors.shopName.types?.maxLength && (
            <Box color="red">{errors.shopName.types.maxLength}</Box>
          )}
          <InputGroup w="100%">
            <Input
              isReadOnly={readOnly}
              bg={readOnly ? "blackAlpha.200" : "white"}
              size="md"
              placeholder={!readOnly ? "お買い物の予算" : ""}
              type="number"
              fontSize={{ base: "sm", md: "md" }}
              {...register("estimatedBudget")}
            />
            <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
              円
            </InputRightElement>
          </InputGroup>
          <Input type="hidden" {...register(`shoppingDatumId`)} />
          <Input type="hidden" {...register(`isFinish`)} />
        </Stack>
        <Box w="5%">
          <Menu>
            <MenuButton as={ChevronDownIcon} />
            <MenuList borderRadius="md" shadow="md">
              <MenuItem onClick={(event) => onClickShoppingDatumModify(event)}>確認&編集</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Box>
  );
});
