import { Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import React, { memo, VFC } from "react";

type Props = {
  textFontSize: string[];
};

export const HomeSpGuidance: VFC<Props> = memo(({ textFontSize }) => {
  return (
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
          <Text fontSize={textFontSize}>買い物記録検索</Text>
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
          <Text fontSize={textFontSize}>効率的なお買い物</Text>
          <Text fontSize={textFontSize}>メモを書く時間の削減</Text>
        </VStack>
        <Image
          src="https://okaimono-portfolio.s3.ap-northeast-1.amazonaws.com/material/12128.svg"
          alt="trash_box"
          boxSize="25%"
          pt={3}
        />
      </HStack>
    </VStack>
  );
});
