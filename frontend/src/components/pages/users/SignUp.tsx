import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { appInfo } from "consts/appconst";
import { UserInputParams } from "interfaces";
import React, { memo, useState, VFC } from "react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { useForm } from "react-hook-form";
import { useAccountSignUp } from "hooks/useAccountSignUp";
import { InputName } from "components/atoms/InputName";
import { InputNameErrors } from "components/atoms/InputNameErrors";
import { InputEmailAddress } from "components/atoms/InputEmailAddress";
import { InputEmailAddressErrors } from "components/atoms/InputEmailAddressErrors";
import { InputPasswordWithButtonErrors } from "components/atoms/InputPasswordWithButtonErrors";
import { InputPasswordWithoutButton } from "components/atoms/InputPasswordWithoutButton";
import { InputPasswordConfirmationWithoutButton } from "components/atoms/InputPasswordConfirmationWithoutButton";
import { InputPasswordConfirmationWithoutButtonErrors } from "components/atoms/InputPasswordConfirmationWithoutButtonErrors";
import { TermsOfService } from "../TermsOfService";

export const SignUp: VFC = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const signUpAccount = useAccountSignUp(setLoading);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UserInputParams>({ criteriaMode: "all", reValidateMode: "onSubmit" });

  // -------------------------------------------------------------------------------------------

  const onSubmit = async (formData: UserInputParams) => {
    signUpAccount(formData);
  };

  // const onClickTermOfService = () => history.push("/user/term_of_service");
  const onClickTermOfService = () => onOpen();
  const onChangeCheckBox = () => setCheck(!check);

  // -------------------------------------------------------------------------------------------

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Flex align="center" justify="center" height="90vh" px={3}>
      <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          {appInfo.Info.appName}
        </Heading>
        <Divider my={4} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text fontSize="xl" textAlign="center">
            アカウント登録
          </Text>
          <Stack spacing={3} py={4} px={10}>
            <InputName register={register} />
            <InputNameErrors errors={errors} />
            <InputEmailAddress register={register} placeholder="Emailアドレス" />
            <InputEmailAddressErrors errors={errors} />
            <InputPasswordWithoutButton register={register} placeholder="パスワード" />
            <InputPasswordWithButtonErrors errors={errors} />
            <InputPasswordConfirmationWithoutButton register={register} getValues={getValues} />
            <InputPasswordConfirmationWithoutButtonErrors errors={errors} />
            <Box />
            <Checkbox size="md" colorScheme="green" onChange={onChangeCheckBox}>
              <HStack>
                <Text as="ins" onClick={onClickTermOfService}>
                  利用規約
                </Text>
                <Text>に同意します。</Text>
              </HStack>
            </Checkbox>
            <PrimaryButtonForReactHookForm loading={loading} disabled={!check}>
              アカウント作成
            </PrimaryButtonForReactHookForm>
          </Stack>
        </form>
      </Box>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>利用規約ページ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TermsOfService />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                閉じる
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Flex>
  );
});
