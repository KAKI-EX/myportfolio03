import { AspectRatio, Box, Heading } from "@chakra-ui/react";
import React, { memo, VFC } from "react";
import { appInfo } from "consts/appconst";

export const HomePcSpYoutube: VFC = memo(() => {
  return (
    <Box shadow="md" borderWidth="1px" bg="green.50" w="95%" mt={2} p={5}>
      <Heading as="h2" size="md" borderBottom="1px" borderColor="gray.300" pt={3}>
        {appInfo.Info.appName}の使用方法
      </Heading>
      <AspectRatio ratio={16 / 9} m={5}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/mV_VuxCoMtQ"
          title="OkaimonoMemo_Introduction"
          allowFullScreen
        />
      </AspectRatio>
    </Box>
  );
});
