import { Box, Heading, HStack, Image, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { memo, useCallback, VFC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { useHistory } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMediaQuery } from "@chakra-ui/media-query";

import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";
import { PrimaryButton } from "components/atoms/PrimaryButton";
import { BsCartCheck } from "react-icons/bs";
import { TbNumber1, TbSquareNumber1, TbSquareNumber2, TbSquareNumber3 } from "react-icons/tb";
import { getCurrentUser } from "lib/api/auth";

// Install Swiper modules
SwiperCore.use([Autoplay, Navigation, Pagination]);

export const Home: VFC = memo(() => {
  const history = useHistory();
  const onClickRegister = useCallback(() => history.push("/user/sign_up"), [history]);
  const headingFontSize = useBreakpointValue({ base: "xl", sm: "xl", md: "xl", lg: "2xl" });
  const textFontSize = ["sm", "md", "md", "xl"];
  const [isLargerThan767] = useMediaQuery("(min-width: 767px)");
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
                </VStack>
              </Box>
            </Box>
            {isLargerThan767 ? (
              <Box w="47%">
                <Swiper
                  centeredSlides
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{ clickable: true }}
                  // navigation
                >
                  <SwiperSlide>
                    <img
                      src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemo_PC1.jpg"
                      alt="Slide 1"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemo_PC2.jpg"
                      alt="Slide 2"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemo_PC3.jpg"
                      alt="Slide 3"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </SwiperSlide>
                </Swiper>
              </Box>
            ) : (
              ""
            )}
          </HStack>
        </Box>
        {!isLargerThan767 ? (
          <Box w="95%">
            <Swiper
              centeredSlides
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              // navigation
            >
              <SwiperSlide>
                <img
                  src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemo_SP1.jpg"
                  alt="Slide 1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemo_SP2.jpg"
                  alt="Slide 2"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/yoko_parts/okaimonomemoSP3.jpg"
                  alt="Slide 3"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            </Swiper>
          </Box>
        ) : (
          ""
        )}
        <Box shadow="md" borderWidth="1px" bg="green.50" w="95%" mt={2} p={5}>
          <Heading as="h2" size="md" borderBottom="1px" borderColor="gray.300" pt={3}>
            OkaimonoMemoでできること
          </Heading>
          {!isLargerThan767 ? (
            <VStack alignItems="center" padding={5}>
              <HStack pt={5} w="100%" justifyContent="left">
                <Image
                  src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/7077.svg"
                  alt="woman_sp"
                  boxSize="22%"
                  pt={3}
                />
                <VStack pl={5}>
                  <Heading as="h3" fontSize={textFontSize}>
                    -- リスト作成時 --
                  </Heading>
                  <Text fontSize={textFontSize}>おつかい機能（メモの共有）</Text>
                  <Text fontSize={textFontSize}>商品名や店舗名の入力補助</Text>
                  <Text fontSize={textFontSize}>合計予算の自動計算</Text>
                </VStack>
              </HStack>
              <HStack pt={5} w="100%" justifyContent="right">
                <VStack pr={5}>
                  <Heading as="h3" fontSize={textFontSize}>
                    -- お買い物時 --
                  </Heading>
                  <Text fontSize={textFontSize}>予算と合計金額の計算</Text>
                  <Text fontSize={textFontSize}>買い忘れの防止</Text>
                  <Text fontSize={textFontSize}>購入商品の消費期限メモ</Text>
                </VStack>
                <Image
                  src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/8357.svg"
                  alt="cart_sp"
                  boxSize="25%"
                  pt={3}
                />
              </HStack>
              <HStack pt={5} w="100%" justifyContent="left">
                <Image
                  src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/8192.png"
                  alt="men_sp"
                  boxSize="30%"
                  pt={3}
                />
                <VStack pl={5}>
                  <Heading as="h3" fontSize={textFontSize}>
                    -- ひまな時 --
                  </Heading>
                  <Text fontSize={textFontSize}>商品名などで買い物記録検索</Text>
                  <Text fontSize={textFontSize}>消費期限の確認と管理</Text>
                  {/* <Text fontSize={textFontSize}>商品名の入力補助機能</Text> */}
                </VStack>
              </HStack>
              <HStack pt={5} w="100%" justifyContent="right">
                <VStack pr={5}>
                  <Heading as="h3" fontSize={textFontSize}>
                    -- その他 --
                  </Heading>
                  <Text fontSize={textFontSize}>食品ロスの削減</Text>
                  <Text fontSize={textFontSize}>効率的なお買い物と購入品管理</Text>
                  <Text fontSize={textFontSize}>買い物メモを書く時間の削減</Text>
                </VStack>
                <Image
                  src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/12128.svg"
                  alt="trash_box"
                  boxSize="25%"
                  pt={3}
                />
              </HStack>
            </VStack>
          ) : null}
          {isLargerThan767 ? (
            <>
              <HStack alignItems="center" padding={5}>
                <HStack pt={5} w="100%" justifyContent="center">
                  <Image
                    src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/7077.svg"
                    alt="woman_sp"
                    boxSize="22%"
                    pt={3}
                  />
                  <VStack pl={5}>
                    <Heading as="h3" fontSize={textFontSize}>
                      -- リスト作成時 --
                    </Heading>
                    <Text fontSize={textFontSize}>おつかい機能（メモの共有）</Text>
                    <Text fontSize={textFontSize}>商品名や店舗名の入力補助</Text>
                    <Text fontSize={textFontSize}>合計予算の自動計算</Text>
                  </VStack>
                </HStack>
                <HStack pt={5} w="100%" justifyContent="center">
                  <VStack pr={5}>
                    <Heading as="h3" fontSize={textFontSize}>
                      -- お買い物時 --
                    </Heading>
                    <Text fontSize={textFontSize}>予算と合計金額の計算</Text>
                    <Text fontSize={textFontSize}>買い忘れの防止</Text>
                    <Text fontSize={textFontSize}>購入商品の消費期限メモ</Text>
                  </VStack>
                  <Image
                    src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/8357.svg"
                    alt="cart_sp"
                    boxSize="25%"
                    pt={3}
                  />
                </HStack>
              </HStack>
              <HStack>
                <HStack pt={5} w="100%" justifyContent="center">
                  <Image
                    src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/8192.png"
                    alt="men_sp"
                    boxSize="30%"
                    pt={3}
                  />
                  <VStack pl={5}>
                    <Heading as="h3" fontSize={textFontSize}>
                      -- ひまな時 --
                    </Heading>
                    <Text fontSize={textFontSize}>商品名などで買い物記録検索</Text>
                    <Text fontSize={textFontSize}>消費期限の確認と管理</Text>
                    {/* <Text fontSize={textFontSize}>商品名の入力補助機能</Text> */}
                  </VStack>
                </HStack>
                <HStack pt={5} w="100%" justifyContent="center">
                  <VStack pr={5}>
                    <Heading as="h3" fontSize={textFontSize}>
                      -- その他 --
                    </Heading>
                    <Text fontSize={textFontSize}>食品ロスの削減</Text>
                    <Text fontSize={textFontSize}>効率的なお買い物と購入品管理</Text>
                    <Text fontSize={textFontSize}>買い物メモを書く時間の削減</Text>
                  </VStack>
                  <Image
                    src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/12128.svg"
                    alt="trash_box"
                    boxSize="25%"
                    pt={3}
                  />
                </HStack>
              </HStack>
            </>
          ) : null}
          <Box pt={[2, 4, 6, 7]} textAlign="center" display="flex" justifyContent="center">
            <PrimaryButton onClick={onClickRegister} fontSize={["md", "lg", "xl"]}>
              今すぐ登録！
            </PrimaryButton>
          </Box>
        </Box>
      </VStack>
      <Box pt={10} pb={4} textAlign="center" display="flex" justifyContent="center">
        <Text>Copyright Kosuke Takaki(2023)</Text>
      </Box>
    </Box>
  );
});
