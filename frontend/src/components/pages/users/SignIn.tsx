import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { ChangeEvent, memo, useCallback, useContext, useState, VFC } from "react";
import { useHistory } from "react-router-dom";

import { PrimaryButton } from "components/atoms/PrimaryButton";
import { appInfo } from "consts/appconst";
import { AuthContext } from "App";
import { useSignIn } from "hooks/useSignIn";
import { useMessage } from "hooks/useToast";

export const SignIn: VFC = memo(() => {
  console.log("SignIn.tsx SignInが走っています。");
  const [userEmail, setUserEmail] = useState("");
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value);

  const [userPassword, setUserPassword] = useState("");
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // -------------------------------------------------------------------------------------------
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const { showMessage } = useMessage();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  console.log(userEmail);
  const handleSubmit = useCallback(
    useSignIn({ userEmail, userPassword, setLoading, setIsSignedIn, setCurrentUser, history, showMessage }),
    [userEmail, userPassword]
  );
  // -------------------------------------------------------------------------------------------

  return loading ? (
    <Box h="50rem" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Flex align="center" justify="center" height="90vh" px={3}>
      <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          {appInfo.Info.appName}
        </Heading>
        <Divider my={4} />
        <Stack spacing={3} py={4} px={10}>
          <Input
            placeholder="Eメールアドレス"
            value={userEmail}
            onChange={onChangeEmail}
            aria-label="Eメールアドレス"
          />
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="パスワード"
              aria-label="パスワード"
              value={userPassword}
              onChange={onChangePassword}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" bg="teal.400" color="white" onClick={handleClick}>
                {show ? "非表示" : "表示"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Box />
          <PrimaryButton
            disabled={userEmail === "" || userPassword === ""}
            onClick={handleSubmit}
            loading={loading}
          >
            ログイン
          </PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
