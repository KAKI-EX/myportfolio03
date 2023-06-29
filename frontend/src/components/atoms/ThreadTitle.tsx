import { Th } from "@chakra-ui/react";
import React, { memo, ReactNode, VFC } from "react";

type Props = {
  children: ReactNode;
  p?: number;
  color: string;
  bg: string;
  w: { base: string; md: string };
  borderBottom: string;
  borderColor: string;
  textAlign: "left" | "right" | "center" | "justify" | undefined;
  fontSize: { base: string; md: string };
  display?: { base: string; md: string };
  px?: string;
};

export const TableThreadTitle: VFC<Props> = memo((props) => {
  const { children, p, color, bg, w, borderBottom, borderColor, textAlign, fontSize, display, px } = props;
  return (
    <Th
      p={p}
      color={color}
      bg={bg}
      w={w}
      borderBottom={borderBottom}
      borderColor={borderColor}
      textAlign={textAlign}
      fontSize={fontSize}
      display={display}
      px={px}
    >
      {children}
    </Th>
  );
});
