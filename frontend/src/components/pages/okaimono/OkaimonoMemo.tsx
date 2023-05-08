import { Box, Divider, Flex, Heading, HStack, Input, Stack } from "@chakra-ui/react";
import { PrimaryButton } from "components/atoms/PrimaryButton";
import { memo, VFC } from "react";
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

export const OkaimonoMemo: VFC = memo(() => {
  const onClickFormAdd = () => {
    alert("test");
  };

  return (
    <Flex align="center" justify="center" px={10}>
      <Box w="80rem">
        <Heading as="h2" size="lg" textAlign="center" py={5}>
          お買い物メモの作成
        </Heading>
        <Divider my={4} />
        <Box borderRadius="md" shadow="md">
          <Heading as="h3" size="md" textAlign="left" px={10} pt={5}>
            お買い物情報
          </Heading>
          <Stack align="center" justify="center" py={6} spacing="3">
            <Input placeholder="Select Date and Time" size="md" type="date" w="50%" />
            <Input placeholder="お店の名前" size="md" w="50%" />
            <Input placeholder="一言メモ" size="md" w="50%" />
            <Divider my={4} />
          </Stack>
          <Heading as="h3" size="sm" textAlign="left" px={10} pt={5}>
            お買い物リスト
          </Heading>
          <Box>
            <Stack px={5} py={5}>
              <HStack spacing={3}>
                <Box w="60%">
                  <Input placeholder="買う商品のなまえ" size="md" w="100%" />
                </Box>
                <Box w="40%">
                  <Input placeholder="だいたいの値段" size="md" w="100%" />
                </Box>
              </HStack>
              <Box>
                <Input placeholder="メモ" size="md" w="100%" />
              </Box>
            </Stack>
            <PrimaryButton onClick={onClickFormAdd}>追加</PrimaryButton>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
});
