import { Heading } from "@chakra-ui/react";
import React, { memo, VFC } from "react";

type Props = {
  as: React.ElementType;
  size: string;
  textAlign: string;
  pt: number;
  pb: number;
  children?: React.ReactNode;
};

export const TitleHeading: VFC<Props> = memo((props) => {
  const { as, size, pt, pb, children } = props;

  return (
    <Heading as={as} size={size} textAlign="center" pt={pt} pb={pb}>
      {children}
    </Heading>
  );
});
