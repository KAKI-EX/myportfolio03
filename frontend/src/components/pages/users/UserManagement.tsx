import { Box, Center, Heading, Text } from "@chakra-ui/react";
import { memo, useCallback, VFC } from "react";
import { useHistory } from "react-router-dom";

export const UserManagement: VFC = memo(() => {
  // const onClickAccountModify = () => {
  //   console.log("アカウント情報の編集");
  // };
  const textFontSize = ["sm", "md", "md", "xl"];
  const history = useHistory();
  const onClickTermOfService = useCallback(() => history.push("/user/term_of_service"), [history]);
  const onClickUserUpdate = useCallback(() => history.push("/user/account_update"), [history]);

  return (
    <Box>
      <Heading as="h1" size="lg" textAlign="center" my={5}>
        マイページ
      </Heading>
      <Center pt={10} onClick={onClickUserUpdate}>
        <Text
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
      <Center>
        <Text
          bg="red.50"
          w="70%"
          textAlign="center"
          px={10}
          borderTop="1px"
          borderColor="gray.400"
          py={4}
          fontSize={textFontSize}
        >
          アカウント情報を削除する
        </Text>
      </Center>
      <Center onClick={onClickTermOfService}>
        <Text
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
