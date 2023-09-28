import { Box, Heading, HStack, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { memo, VFC } from "react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { useHistory } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMediaQuery } from "@chakra-ui/media-query";

import { PrimaryButton } from "components/atoms/PrimaryButton";
import { useGuestSignIn } from "hooks/useGuestSignIn";
import { HomePcSlide } from "components/molecules/HomePcSlide";
import { HomeSpSlide } from "components/molecules/HomeSpSlide";
import { HomeSpGuidance } from "components/molecules/HomeSpGuidance";
import { HomePcGuidance } from "components/molecules/HomePcGuidance";

// Install Swiper modules
SwiperCore.use([Autoplay, Navigation, Pagination]);

export const Home: VFC = memo(() => {
  const history = useHistory();
  // const [loading, setLoading] = useState(false);
  const runGuestSignIn = useGuestSignIn();

  const onClickRegister = () => history.push("/user/sign_up");
  const headingFontSize = useBreakpointValue({ base: "xl", sm: "xl", md: "xl", lg: "2xl" });
  const textFontSize = ["sm", "md", "md", "xl"];
  const [isLargerThan767] = useMediaQuery("(min-width: 767px)");

  const onClickGuestSignIn = () => {
    runGuestSignIn();
  };

  return (
    <Box w="100%" justifyContent="center">
      <VStack>
        <Box shadow="md" borderWidth="1px" bg="green.50" w="95%" mt={2} p={5}>
          <HStack w="100%">
            <Box pl={[0, 4, 6, 8]} w={isLargerThan767 ? "53%" : "100%"}>
              <Box textAlign="center" display="flex" justifyContent="center">
                <VStack>
                  <Text mb="-1" fontSize={["xs", "sm", "md", "lg"]}>
                    お買い物サポートアプリ
                  </Text>
                  <Heading as="h1" size={headingFontSize}>
                    OkaimonoMemo
                  </Heading>
                  <Text color="gray.600" fontSize={textFontSize} pt={[1, 3, 4, 5]} pl={[0, 3, 4, 5]}>
                    消費期限管理、お買い物メモを一括管理！
                  </Text>
                  <Text color="gray.600" fontSize={textFontSize} pl={[0, 3, 4, 5]}>
                    買い忘れた時の「おつかい機能」も便利！
                  </Text>
                  <Box pt={[2, 4, 6, 7]} textAlign="center" display="flex" justifyContent="center">
                    <PrimaryButton onClick={onClickRegister} fontSize={["md", "lg", "xl"]}>
                      今すぐ登録！
                    </PrimaryButton>
                  </Box>
                  <Text as="ins" fontSize={textFontSize} onClick={onClickGuestSignIn}>
                    またはここからゲストログイン
                  </Text>
                </VStack>
              </Box>
            </Box>
            {isLargerThan767 ? <HomePcSlide /> : ""}
          </HStack>
        </Box>
        {!isLargerThan767 ? <HomeSpSlide /> : ""}
        <Box shadow="md" borderWidth="1px" bg="green.50" w="95%" mt={2} p={5}>
          <Heading as="h2" size="md" borderBottom="1px" borderColor="gray.300" pt={3}>
            OkaimonoMemoでできること
          </Heading>
          {!isLargerThan767 ? <HomeSpGuidance textFontSize={textFontSize} /> : null}
          {isLargerThan767 ? <HomePcGuidance textFontSize={textFontSize} /> : null}
          <Box pt={[2, 4, 6, 7]} textAlign="center" display="flex" justifyContent="center">
            <VStack>
              <PrimaryButton onClick={onClickRegister} fontSize={["md", "lg", "xl"]}>
                今すぐ登録！
              </PrimaryButton>
              <Text as="ins" fontSize={textFontSize} onClick={onClickGuestSignIn}>
                またはここからゲストログイン
              </Text>
            </VStack>
          </Box>
        </Box>
      </VStack>
      <Box pt={10} pb={4} textAlign="center" display="flex" justifyContent="center">
        <Text>Copyright Kosuke Takaki(2023)</Text>
      </Box>
    </Box>
  );
});
