import { Box } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useParams } from "react-router-dom";

export const OkaimonoShow: VFC = memo(() => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  return <Box>あはは</Box>;
});
