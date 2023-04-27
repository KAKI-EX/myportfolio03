import { Box, Button, Divider, Flex, Heading, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react";
import { PrimaryButton } from "components/atoms/PrimaryButton";

import { appInfo } from "consts/appconst";
import { ChangeEvent, memo, useState, VFC } from "react";

export const SignIn: VFC = memo(() => {
  const onClickLogin = () => alert("");

  const [userId, setUserId] = useState("");
  const onChangeUserId = (e: ChangeEvent<HTMLInputElement>) => setUserId(e.target.value);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          {appInfo.Info.appName}
        </Heading>
        <Divider my={4} />
        <Stack spacing={3} py={4} px={10}>
          <Input placeholder="ユーザーID" value={userId} onChange={onChangeUserId} aria-label="ユーザーID" />
          <InputGroup size="md">
            <Input pr="4.5rem" type={show ? "text" : "password"} placeholder="パスワード" aria-label="パスワード" />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" bg="teal.400" color="white" onClick={handleClick}>
                {show ? "非表示" : "表示"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Box />
          <PrimaryButton
            // disabled={userId === ""}
            // loading={loading}
            onClick={onClickLogin}
          >
            ログイン
          </PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
